import { INIT_EVENT, INIT_STATE, NO_OUTPUT } from "state-transducer";
import { destructureEvent, NO_ACTIONS, NO_INTENT, renderAction, renderGalleryApp, runSearchQuery } from "../helpers";
import h from "react-hyperscript";
import Flipping from "flipping";
import { filter, flatMap, map, shareReplay } from "rxjs/operators";
import { BehaviorSubject, merge, Observable } from "rxjs";
import { GalleryApp } from "./components";
import { getStateTransducerRxAdapter } from "../../src/Machine";
import { shareReplay } from "rxjs/operators/index";

export const BUTTON_CLICKED = "button_clicked";
export const KEY_PRESSED = "key_pressed";
export const INPUT_KEY_PRESSED = "input_key_pressed";
export const ENTER_KEY_PRESSED = "enter_key_pressed";
export const INPUT_CHANGED = "input_changed";
export const KEY_ENTER = `Enter`;
export const COMMAND_SEARCH = "command_search";

const RxApi = {BehaviorSubject, Observable, merge, filter, flatMap, map, shareReplay};

export const imageGallerySwitchMap = {
  initialExtendedState: { query: "", items: [], photo: undefined, gallery: "" },
  states: { start: "", loading: "", gallery: "", error: "", photo: "" },
  events: ["SEARCH", "SEARCH_SUCCESS", "SEARCH_FAILURE", "CANCEL_SEARCH", "SELECT_PHOTO", "EXIT_PHOTO"],
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
    filter(x => x !== NO_INTENT)
  ),
  transitions: [
    { from: INIT_STATE, event: INIT_EVENT, to: "start", action: NO_ACTIONS },
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
      const searchCommand = { command: COMMAND_SEARCH, params: query };
      const renderGalleryAction = renderAction(trigger =>
        h(GalleryApp, { query, items, trigger, photo, gallery: "loading" }, [])
      );

      return {
        outputs: [searchCommand, renderGalleryAction.outputs],
        updates: []
      };
    },
    photo: renderGalleryApp("photo"),
    gallery: renderGalleryApp("gallery"),
    error: renderGalleryApp("error"),
    start: renderGalleryApp("start")
  },
  effectHandlers: { runSearchQuery },
  commandHandlers: {
    [COMMAND_SEARCH]: (obs, effectHandlers) => {
      const { runSearchQuery } = effectHandlers;

      return obs.pipe(switchMap(({ trigger, params }) => {
        const query = params;
        return runSearchQuery(query)
          .then(data => {
            trigger("SEARCH_SUCCESS")(data.items);
          })
          .catch(error => {
            trigger("SEARCH_FAILURE")(void 0);
          });
      }));
    }
  },
  inject: new Flipping(),
  componentWillUpdate: flipping => (machineComponent, prevProps, prevState, snapshot, settings) => {flipping.read();},
  componentDidUpdate: flipping => (machineComponent, nextProps, nextState, settings) => {flipping.flip();},
};

