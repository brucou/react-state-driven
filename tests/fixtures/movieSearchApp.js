import React, { Component } from "react";
import h from "react-hyperscript";
import { Machine } from "../../src";
import { createStateMachine } from "state-transducer";
import { applyPatch } from "json-patch-es6";
import { movieSearchFsmDef } from "./movieSearchFsm";

/**
 *
 * @param {ExtendedState} extendedState
 * @param {Operation[]} extendedStateUpdateOperations
 * @returns {ExtendedState}
 */
export function applyJSONpatch(extendedState, extendedStateUpdateOperations) {
  return applyPatch(
    extendedState,
    extendedStateUpdateOperations || [],
    false,
    false
  ).newDocument;
}

const fsm = createStateMachine(movieSearchFsmDef, {
  updateState: applyJSONpatch
});

const App = h(
  Machine,
  {
    // TODO : write it with transducers, and emitonoff emitter, will have to do lots of API surfacing, and change
    // emit to next in state-transducer -? new version pass it to master
    // TODO : mmm but I must have implementation on th 7.1 though, will that not delay me a lot? should not
    // worse case use rx
    eventHandler: movieSearchFsmDef.eventHandler,
    preprocessor: movieSearchFsmDef.preprocessor,
    fsm: fsm,
    commandHandlers: movieSearchFsmDef.commandHandlers,
    effectHandlers: movieSearchFsmDef.effectHandlers
  },
  []
);

export default App;
