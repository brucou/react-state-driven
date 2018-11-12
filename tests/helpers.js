import { mapOverObj } from "fp-rosetree"
import { applyPatch } from "json-patch-es6";
import { CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE, NO_STATE_UPDATE, NO_OUTPUT, INIT_EVENT  } from "state-transducer";
import React from 'react';
import fetchJsonp from "fetch-jsonp"
import produce, { nothing } from "immer"
import h from "react-hyperscript";
import hyperscript from "hyperscript-helpers";
import { filter, flatMap, map, shareReplay } from "rxjs/operators";
import { Observable, merge, Subject, BehaviorSubject, from, of, range } from 'rxjs';

const { div, button, span, input, form, section, img, h1 } = hyperscript(h);

export const noop = () => {};
export const stateTransducerRxAdapter = {
  // NOTE : this is start the machine, by sending the INIT_EVENT immediately prior to any other
  subjectFactory: () => new BehaviorSubject([INIT_EVENT, void 0]),
  // NOTE : must be bound, because, reasons
  merge: merge,
  create: fn => Observable.create(fn),
  filter: filter,
  map: map,
  flatMap: flatMap,
  shareReplay: shareReplay
};

export const ERR_COMMAND_HANDLERS = command => (`Cannot find valid executor for command ${command}`)
export const BUTTON_CLICKED = 'button_clicked';
export const KEY_PRESSED = 'key_pressed';
export const INPUT_KEY_PRESSED = 'input_key_pressed';
export const ENTER_KEY_PRESSED = 'enter_key_pressed';
export const INPUT_CHANGED = 'input_changed';
export const NO_ACTIONS = () => ({ outputs: NO_OUTPUT, updates: NO_STATE_UPDATE });
export const KEY_ENTER = `Enter`;
export const NO_INTENT = null;
export const COMMAND_SEARCH = 'command_search';
export const COMMAND_RENDER = 'render';

export class Form extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  render() {
    const Component = this;
    const { galleryState, onSubmit, onClick } = Component.props;

    const searchText = {
      loading: 'Searching...',
      error: 'Try search again',
      start: 'Search'
    }[galleryState] || 'Search';
    const isLoading = galleryState === 'loading';

    return (
      form(".ui-form", { onSubmit: ev => onSubmit(ev, this.formRef) }, [
        input(".ui-input", {
          ref: this.formRef,
          type: "search",
          placeholder: "Search Flickr for photos...",
          disabled: isLoading,
        }),
        div(".ui-buttons", [
          button(".ui-button", { disabled: isLoading, 'data-flip-key': "search" }, searchText),
          isLoading && button(".ui-button", {
            type: "button",
            onClick: onClick
          }, 'Cancel')
        ])
      ])
    )
  }
}

export class Gallery extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { galleryState, items, onClick } = this.props;
    const isError = galleryState === 'error';

    return (
      section(".ui-items", { 'data-state': galleryState }, [
        isError
          ? span(".ui-error", `Uh oh, search failed.`)
          : items.map((item, i) => img(".ui-item", {
            src: item.media.m,
            style: { '--i': i },
            key: item.link,
            onClick: ev => onClick(item)
          }))
      ])
    );
  }
}

export class Photo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // NOTE: by machine construction, `photo` exists and is not null
    const { galleryState, onClick, photo } = this.props;

    if (galleryState !== 'photo') return null;

    return (
      section(".ui-photo-detail", { onClick }, [
        img(".ui-photo", { src: photo.media.m })
      ])
    )
  }
}

export class GalleryApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { query, photo, items, trigger, gallery: galleryState } = this.props;

    return div(".ui-app", { 'data-state': galleryState }, [
      h(Form, { galleryState, onSubmit: trigger('onSubmit'), onClick: trigger('onCancelClick') }, []),
      h(Gallery, { galleryState, items, onClick: trigger('onGalleryClick') }, []),
      h(Photo, { galleryState, photo, onClick: trigger('onPhotoClick') }, [])
    ])
  }
}

function isFunction(obj) {
  return typeof obj === 'function'
}

function isPOJO(obj) {
  const proto = Object.prototype;
  const gpo = Object.getPrototypeOf;

  if (obj === null || typeof obj !== "object") {
    return false;
  }
  return gpo(obj) === proto;
}

export function formatResult(result) {
  if (!isPOJO(result)) {
    return result
  }
  else {
    return mapOverObj({
        key: x => x,
        leafValue: prop => isFunction(prop)
          ? (prop.name || prop.displayName || 'anonymous')
          : Array.isArray(prop)
            ? prop.map(formatResult)
            : prop
      },
      result)
  }
}

export function formatMap(mapObj){
  return Array.from(mapObj.keys()).map(key => ([key, formatFunction(mapObj.get(key))]))
}

export function formatFunction(fn){
  return fn.name || fn.displayName || 'anonymous'
}

export function isArrayOf(predicate) {return obj => Array.isArray(obj) && obj.every(predicate)}

export function isArrayUpdateOperations(obj) {
  return isEmptyArray(obj) || isArrayOf(isUpdateOperation)(obj)
}

export function isEmptyArray(obj) {return Array.isArray(obj) && obj.length === 0}

export function assertContract(contractFn, contractArgs, errorMessage) {
  const boolOrError = contractFn.apply(null, contractArgs)
  const isPredicateSatisfied = isBoolean(boolOrError) && boolOrError;

  if (!isPredicateSatisfied) {
    throw `assertContract: fails contract ${contractFn.name}\n${errorMessage}\n ${boolOrError}`
  }
  return true
}

export function isBoolean(obj) {return typeof(obj) === 'boolean'}
export function isUpdateOperation(obj) {
  return (typeof(obj) === 'object' && Object.keys(obj).length === 0) ||
    (
      ['add', 'replace', 'move', 'test', 'remove', 'copy'].some(op => obj.op === op) &&
      typeof(obj.path) === 'string'
    )
}


/**
 *
 * @param {ExtendedState} extendedState
 * @param {Operation[]} extendedStateUpdateOperations
 * @returns {ExtendedState}
 */
export function applyJSONpatch(extendedState, extendedStateUpdateOperations) {
  assertContract(isArrayUpdateOperations, [extendedStateUpdateOperations],
    `applyUpdateOperations : ${CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE}`);

  // NOTE : we don't validate operations, to avoid throwing errors when for instance the value property for an
  // `add` JSON operation is `undefined` ; and of course we don't mutate the document in place
  return applyPatch(extendedState, extendedStateUpdateOperations || [], false, false).newDocument;
}

export function identity(x) {return x}

/**
 *
 * @param Component
 * @param {Object} [props={}]
 * @returns {RenderCommand}
 */
export function renderCommandFactory(Component, props = {}) {
  return {
    command: COMMAND_RENDER,
    params: trigger => React.createElement(Component, props, null)
  }
}

export function renderAction(params) {
  return { outputs: { command: COMMAND_RENDER, params }, updates: NO_STATE_UPDATE }
}
export function renderActionImmer(params) {
  return { outputs: { command: COMMAND_RENDER, params }, updates: nothing }
}

export function getEventName(eventStruct) {
  return eventStruct[0]
}

export function getEventData(eventStruct) {
  return eventStruct[1]
}

export function runSearchQuery(query) {
  const encodedQuery = encodeURIComponent(query);

  return fetchJsonp(
    `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=${encodedQuery}`,
    { jsonpCallback: 'jsoncallback' }
  )
    .then(res => res.json())
}

export function renderGalleryApp(galleryState) {
  return function _renderGalleryApp(extendedState, _, fsmSettings) {
    const { query, items, photo } = extendedState;

    return renderAction(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: galleryState }, []));
  }
}

export function renderGalleryAppImmer(galleryState) {
  return function _renderGalleryApp(extendedState, _, fsmSettings) {
    const { query, items, photo } = extendedState;

    return renderActionImmer(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: galleryState }, []));
  }
}

export function destructureEvent(eventStruct) {
  return {
    rawEventName: eventStruct[0],
    rawEventData: eventStruct[1],
    ref: eventStruct[2]
  };
}

export const NO_IMMER_UPDATES = nothing;
export const immerReducer = function (extendedState, updates) {
  if (updates === NO_IMMER_UPDATES) return extendedState
  const updateFn = updates;
  return produce(extendedState, updateFn)
};

export const mergeOutputs = function (accOutputs, outputs) {
  return (accOutputs || []).concat(outputs || [])
};

/**
 *
 * @param input
 * @param [generatorState]
 * @returns {function(*, *): {hasGeneratedInput: boolean, input: *, generatorState: *}}
 */
export function constGen(input, generatorState){
  return function constGen(extS, genS){
    return { hasGeneratedInput:true,       input,        generatorState      }
  }
}
