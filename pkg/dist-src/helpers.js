import { COMMAND_RENDER, NO_STATE_UPDATE } from "./properties.js";
/**
 *
 * @param Component
 * @param {Object} [props={}]
 * @returns {RenderCommand}
 */

export function renderAction(params) {
  return {
    outputs: {
      command: COMMAND_RENDER,
      params: params
    },
    updates: NO_STATE_UPDATE
  };
}
export function getEventName(eventStruct) {
  return eventStruct[0];
}
export function getEventData(eventStruct) {
  return eventStruct[1];
}
export function destructureEvent(eventStruct) {
  return {
    rawEventName: eventStruct[0],
    rawEventData: eventStruct[1],
    ref: eventStruct[2]
  };
}
export function identity(x) {
  return x;
}
export function tryCatch(fn, errCb) {
  return function tryCatch() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    try {
      return fn.apply(fn, args);
    } catch (e) {
      return errCb(e, args);
    }
  };
}
/**
 *
 * @param {{console, debugEmitter, connection}} debug
 * @param errMsg
 * @returns {logAndRethrow}
 */

export var logAndRethrow = function logAndRethrowCurried(debug, errMsg) {
  // TODO : I should also catch errors occuring there and pass it to the debugEmitter
  return function logAndRethrow(e, args) {
    debug && debug.console && debug.console.error("logAndRethrow :> errors", errMsg, e);
    debug && debug.console && debug.console.error("logAndRethrow :> args ", args);
    throw e;
  };
};