import { COMMAND_RENDER, NO_STATE_UPDATE } from "./properties";

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
      params
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

export function defaultRenderHandler(component, newState, callback) {
  return component.setState(newState, callback);
}

export function tryCatch(fn, err){
  return function (...args){
    try{
    return fn(...args)
    }
    catch (e) {
      return err(e)
    }
  }
}
