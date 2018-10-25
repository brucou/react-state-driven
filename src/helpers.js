import { applyPatch } from "json-patch-es6";
import { COMMAND_RENDER, CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE, NO_STATE_UPDATE } from "./properties";
import React from 'react';

export function isBoolean(obj) {return typeof(obj) === 'boolean'}

export function isUpdateOperation(obj) {
  return (typeof(obj) === 'object' && Object.keys(obj).length === 0) ||
    (
      ['add', 'replace', 'move', 'test', 'remove', 'copy'].some(op => obj.op === op) &&
      typeof(obj.path) === 'string'
    )
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
    throw new Error(`assertContract: fails contract ${contractFn.name}\n${errorMessage}\n ${boolOrError}`)
  }
  return true
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
  return applyPatch(extendedState, extendedStateUpdateOperations, false, false).newDocument;
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
  return {
    outputs: {
      command: COMMAND_RENDER,
      params
    },
    updates : NO_STATE_UPDATE
  }
}

export function getEventName(eventStruct) {
  return eventStruct[0]
}

export function getEventData(eventStruct) {
  return eventStruct[1]
}

export function destructureEvent(eventStruct){
  return {
    rawEventName : eventStruct[0],
    rawEventData : eventStruct[1],
    ref : eventStruct[2]
  }
}
