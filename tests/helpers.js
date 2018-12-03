import { mapOverObj, mapOverTree } from "fp-rosetree";
import { applyPatch } from "json-patch-es6";
import { CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE, INIT_EVENT, NO_OUTPUT, NO_STATE_UPDATE } from "state-transducer";
import React from "react";
import prettyFormat from "pretty-format";
import fetchJsonp from "fetch-jsonp";
import produce, { nothing } from "immer";
import h from "react-hyperscript";
import { GalleryApp } from "./fixtures/components";
import HTML from "html-parse-stringify";
import { assoc, forEachObjIndexed, keys, mergeAll, mergeLeft, omit, trim } from "ramda";
import { COMMAND_RENDER } from "../src";

const { parse, stringify } = HTML;

export const noop = () => {};

export const ERR_COMMAND_HANDLERS = command => (`Cannot find valid executor for command ${command}`);
export const NO_ACTIONS = () => ({ outputs: NO_OUTPUT, updates: NO_STATE_UPDATE });
export const NO_INTENT = null;
export const COMMAND_SEARCH = "command_search";

function isFunction(obj) {
  return typeof obj === "function";
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
    return result;
  }
  else {
    return mapOverObj({
        key: x => x,
        leafValue: prop => isFunction(prop)
          ? (prop.name || prop.displayName || "anonymous")
          : Array.isArray(prop)
            ? prop.map(formatResult)
            : prop
      },
      result);
  }
}

export function formatMap(mapObj) {
  return Array.from(mapObj.keys()).map(key => ([key, formatFunction(mapObj.get(key))]));
}

export function formatFunction(fn) {
  return fn.name || fn.displayName || "anonymous";
}

export function isArrayOf(predicate) {return obj => Array.isArray(obj) && obj.every(predicate);}

export function isArrayUpdateOperations(obj) {
  return isEmptyArray(obj) || isArrayOf(isUpdateOperation)(obj);
}

export function isEmptyArray(obj) {return Array.isArray(obj) && obj.length === 0;}

export function assertContract(contractFn, contractArgs, errorMessage) {
  const boolOrError = contractFn.apply(null, contractArgs);
  const isPredicateSatisfied = isBoolean(boolOrError) && boolOrError;

  if (!isPredicateSatisfied) {
    throw `assertContract: fails contract ${contractFn.name}\n${errorMessage}\n ${boolOrError}`;
  }
  return true;
}

export function isBoolean(obj) {return typeof(obj) === "boolean";}

export function isUpdateOperation(obj) {
  return (typeof(obj) === "object" && Object.keys(obj).length === 0) ||
    (
      ["add", "replace", "move", "test", "remove", "copy"].some(op => obj.op === op) &&
      typeof(obj.path) === "string"
    );
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

export function identity(x) {return x;}

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
  };
}

export function renderAction(params) {
  return { outputs: { command: COMMAND_RENDER, params }, updates: NO_STATE_UPDATE };
}

export function renderActionImmer(params) {
  return { outputs: { command: COMMAND_RENDER, params }, updates: nothing };
}

export function getEventName(eventStruct) {
  return eventStruct[0];
}

export function getEventData(eventStruct) {
  return eventStruct[1];
}

export function runSearchQuery(query) {
  const encodedQuery = encodeURIComponent(query);

  return fetchJsonp(
    `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=${encodedQuery}`,
    { jsonpCallback: "jsoncallback" }
  )
    .then(res => res.json());
}

export function renderGalleryApp(galleryState) {
  return function _renderGalleryApp(extendedState, _, fsmSettings) {
    const { query, items, photo } = extendedState;

    return renderAction(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: galleryState }, []));
  };
}

export function renderGalleryAppImmer(galleryState) {
  return function _renderGalleryApp(extendedState, _, fsmSettings) {
    const { query, items, photo } = extendedState;

    return renderActionImmer(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: galleryState }, []));
  };
}

export function destructureEvent(eventStruct) {
  return {
    rawEventName: eventStruct[0],
    rawEventData: eventStruct[1],
    ref: eventStruct[2]
  };
}

export const NO_IMMER_UPDATES = nothing;
export const immerReducer = function(extendedState, updates) {
  if (updates === NO_IMMER_UPDATES) return extendedState;
  const updateFn = updates;
  return produce(extendedState, updateFn);
};

export const mergeOutputs = function(accOutputs, outputs) {
  return (accOutputs || []).concat(outputs || []);
};

/**
 *
 * @param input
 * @param [generatorState]
 * @returns {function(*, *): {hasGeneratedInput: boolean, input: *, generatorState: *}}
 */
export function constGen(input, generatorState) {
  return function constGen(extS, genS) {
    return { hasGeneratedInput: true, input, generatorState };
  };
}

const { DOMElement, DOMCollection } = prettyFormat.plugins;

export function prettyDOM(htmlElement, maxLength, options) {
  if (htmlElement.documentElement) {
    htmlElement = htmlElement.documentElement;
  }

  const debugContent = prettyFormat(htmlElement, {
    plugins: [DOMElement, DOMCollection],
    printFunctionName: false,
    // highlight: true,
    ...options
  });
  return maxLength !== undefined && htmlElement.outerHTML.length > maxLength
    ? `${debugContent.slice(0, maxLength)}...`
    : debugContent;
}

/**
 * We remove data-testid attributes from an html string, and impose the same order for attributes for easier
 * comparison between two functionally equivalent HTML strings
 * force trim and `;` character at the end of style attributes
 * NTH : mix with better version here : https://github.com/TimothyRHuertas/normalizer
 * NTH : also normalize UTF-16...
 * @param str
 */
export function normalizeHTML(str) {
  const strTree = { type: "root", children: parse(str) };
  const lenses = {
    getLabel: tree => {
      const label = omit(["children"], tree);
      // Sort the `attrs`'s keys
      const { type, name, voidElement, content, attrs } = label;
      let arrAttr = [];
      forEachObjIndexed((value, key) => arrAttr.push({ [key]: value }), attrs);
      arrAttr.sort((a, b) => keys(a)[0] > keys(b)[0] ? 1 : -1);
      return assoc("attrs", mergeAll(arrAttr), label);
    },
    getChildren: tree => tree.children || [],
    constructTree: (label, children) => {
      return mergeLeft({ children }, label);
    }
  };
  const mapFn = label => {
    const { type, name, voidElement, content, attrs } = label;
    if (type !== "component") {
      let style = attrs && attrs.style && trim(attrs.style);
      if (attrs && "style" in attrs) {
        if (style[style.length - 1] !== ";") {
          style = style + ";";
        }
      }
      return {
        type, name, voidElement, content,
        attrs: attrs && style
          ? assoc("style", style, omit(["data-testid"], attrs))
          : attrs && omit(["data-testid"], attrs)
      };
    }
  };

  const result = mapOverTree(lenses, mapFn, strTree);
  return stringify(result.children);
}


