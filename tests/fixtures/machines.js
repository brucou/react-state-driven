import { INIT_EVENT, NO_OUTPUT } from "state-transducer";
import { destructureEvent, NO_ACTIONS, NO_INTENT, renderAction, runSearchQuery } from "../helpers";
import h from "react-hyperscript";
import Flipping from "flipping";
import { concatMap, filter, flatMap, map, shareReplay, startWith } from "rxjs/operators";
import { merge, Observable, Subject } from "rxjs";
import { GalleryApp, triggerFnFactory } from "./components";
import { getStateTransducerRxAdapter } from "../../src/Machine";
import { COMMAND_RENDER } from "../../src";

export const BUTTON_CLICKED = "button_clicked";
export const KEY_PRESSED = "key_pressed";
export const INPUT_KEY_PRESSED = "input_key_pressed";
export const ENTER_KEY_PRESSED = "enter_key_pressed";
export const INPUT_CHANGED = "input_changed";
export const KEY_ENTER = `Enter`;
export const COMMAND_SEARCH = "command_search";

const RxApi = { Subject, Observable, merge, filter, flatMap, concatMap, map, startWith, shareReplay };

function makeRenderCommand(gallery) {
  return function(extendedState, eventData, fsmSettings) {
    const { query, items, photo } = extendedState;
debugger
    return {
      outputs: [{
        command: COMMAND_RENDER,
        params: { query, photo, items, gallery }
      }],
      updates: []
    };
  };
}

export const imageGallery = {
  options: { debug: { console } },
  initialExtendedState: { query: "", items: [], photo: undefined, gallery: "" },
  initialControlState: "init",
  states: { init: "", start: "", loading: "", gallery: "", error: "", photo: "" },
  events: ["START", "SEARCH", "SEARCH_SUCCESS", "SEARCH_FAILURE", "CANCEL_SEARCH", "SELECT_PHOTO", "EXIT_PHOTO"],
  eventHandler: getStateTransducerRxAdapter(RxApi),
  preprocessor: rawEventSource => rawEventSource.pipe(
    map(ev => {
      const { rawEventName, rawEventData: e, ref } = destructureEvent(ev);

      if (rawEventName === INIT_EVENT) {
        return { [INIT_EVENT]: void 0 };
      }
      // Form raw events
      else if (rawEventName === "onSubmit") {
        e.persist();
        e.preventDefault();
        return { SEARCH: ref.current.value };
      }
      else if (rawEventName === "onCancelClick") {
        return { CANCEL_SEARCH: void 0 };
      }
      // Gallery
      else if (rawEventName === "onGalleryClick") {
        const item = e;
        return { SELECT_PHOTO: item };
      }
      // Photo detail
      else if (rawEventName === "onPhotoClick") {
        return { EXIT_PHOTO: void 0 };
      }
      // System events
      else if (rawEventName === "SEARCH_SUCCESS") {
        const items = e;
        return { SEARCH_SUCCESS: items };
      }
      else if (rawEventName === "SEARCH_FAILURE") {
        return { SEARCH_FAILURE: void 0 };
      }

      return NO_INTENT;
    }),
    filter(x => x !== NO_INTENT),
    startWith({ START: void 0 })
  ),
  renderWith: GalleryApp,
  transitions: [
    { from: "init", event: "START", to: "start", action: NO_ACTIONS },
    { from: "start", event: "SEARCH", to: "loading", action: NO_ACTIONS },
    {
      from: "loading", event: "SEARCH_SUCCESS", to: "gallery", action: (extendedState, eventData, fsmSettings) => {
        const items = eventData;

        return {
          updates: [{ op: "add", path: "/items", value: items }],
          outputs: NO_OUTPUT
        };
      }
    },
    { from: "loading", event: "SEARCH_FAILURE", to: "error", action: NO_ACTIONS },
    { from: "loading", event: "CANCEL_SEARCH", to: "gallery", action: NO_ACTIONS },
    { from: "error", event: "SEARCH", to: "loading", action: NO_ACTIONS },
    { from: "gallery", event: "SEARCH", to: "loading", action: NO_ACTIONS },
    {
      from: "gallery", event: "SELECT_PHOTO", to: "photo", action: (extendedState, eventData, fsmSettings) => {
        const item = eventData;

        return {
          updates: [{ op: "add", path: "/photo", value: item }],
          outputs: NO_OUTPUT
        };
      }
    },
    { from: "photo", event: "EXIT_PHOTO", to: "gallery", action: NO_ACTIONS }
  ],
  entryActions: {
    loading: (extendedState, eventData, fsmSettings) => {
      const { items, photo } = extendedState;
      const query = eventData;
      const searchCommand = { command: COMMAND_SEARCH, params: { query } };
      const renderGalleryAction = makeRenderCommand("loading")({query, items, photo}, eventData, fsmSettings);

      return {
        outputs: [searchCommand].concat(renderGalleryAction.outputs),
        updates: []
      };
    },
    photo: makeRenderCommand("photo"),
    gallery: makeRenderCommand("gallery"),
    error: makeRenderCommand("error"),
    start: makeRenderCommand("start")
  },
  effectHandlers: { runSearchQuery },
  commandHandlers: {
    [COMMAND_SEARCH]: (next, params, effectHandlersWithRender) => {
      const { runSearchQuery } = effectHandlersWithRender;
      const {query} = params;
      return runSearchQuery(query)
        .then(data => {
          // The preprocessor expect arguments in form of an array!
          next(["SEARCH_SUCCESS", data.items]);
        })
        .catch(error => {
          next(["SEARCH_FAILURE", void 0]);
        });
    }
  },
  inject: new Flipping(),
  componentWillUpdate: flipping => (machineComponent, prevProps, prevState, snapshot, settings) => {flipping.read();},
  componentDidUpdate: flipping => (machineComponent, nextProps, nextState, settings) => {flipping.flip();}
};

