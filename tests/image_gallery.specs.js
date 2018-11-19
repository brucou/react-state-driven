import React from "react";
// import sinon from 'sinon';
import { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } from "react-testing-library";
import { create_state_machine, decorateWithEntryActions, INIT_EVENT } from "state-transducer";
import { Machine } from "../src";
import { applyJSONpatch, getEventName, noop, prettyDOM, stateTransducerRxAdapter } from "./helpers";
import { testCases } from "./assets/test-generation";
import prettyFormat from "pretty-format";
import { imageGallerySwitchMap } from "./fixtures/machines";
import { SEARCH } from "./fixtures/test-ids";

// TODO
export function fromFsmToActualOutput(expectedFsmOutputSequence) {
  return expectedFsmOutputSequence.map(x => null);
}

QUnit.module("Testing image gallery component", {
  // afterEach : cleanup
});
let testCase;

// TODO : make a loop on testCase with Qunit test inside
// ["nok", "start", "loading", "gallery", "loading", "gallery"]
testCase = testCases[0];
QUnit.test(`${testCase.controlStateSequence.join(" -> ")}`, function exec_test(assert) {
  const rtl = {render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText};
  let actualOutputSequence = [];
  const inputSequence = testCase.inputSequence;
  // TODO : should test that length of input and output sequence are the same!! that is an hypothesis here
  const expectedFsmOutputSequence = testCase.outputSequence;
  // TODO : turn fsm output into actual output
  const expectedOutputSequence = fromFsmToActualOutput(expectedFsmOutputSequence);
  const anchor = document.getElementById("app");
  const machine = imageGallerySwitchMap;
  const fsmSpecsWithEntryActions = decorateWithEntryActions(machine, machine.entryActions, null);
  const fsm = create_state_machine(fsmSpecsWithEntryActions, { updateState: applyJSONpatch });

  const imageGallery = React.createElement(Machine, {
    eventHandler: stateTransducerRxAdapter,
    preprocessor: machine.preprocessor,
    fsm: fsm,
    // TODO : mock jsonp
     commandHandlers: machine.commandHandlers,
    componentWillUpdate: (machine.componentWillUpdate || noop)(machine.inject),
    componentDidUpdate: (machine.componentDidUpdate || noop)(machine.inject)
  }, null);

  const assertions = {
    // {[INIT_EVENT]: ..} -> [null, { command: "render" }],
    [INIT_EVENT]: (component, anchor, rtl, eventData, expectedOutput) => {
      const eventName = INIT_EVENT;
      const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;

      const { baseElement, container, rerender, asFragment } = render(component, { container: anchor });
      const actualOutput = prettyDOM(baseElement);
      assert.deepEqual(actualOutput, expectedOutput, `ok with : ${prettyFormat({ [eventName]: eventData })}`);
    },
    // { SEARCH: "cathether" } --> [null, { command: "command_search", params: "cathether" }, { command: "render" }],
    "SEARCH": (component, anchor, rtl, eventData, expectedOutput) => {
      const eventName = SEARCH;
      const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;

      fireEvent.click(getByTestId(SEARCH));
      return waitForElement(() => true)
        .then(() => {
          const actualOutput = prettyDOM(baseElement);
          assert.deepEqual(actualOutput, expectedOutput, `ok with : ${prettyFormat({ [eventName]: eventData })}`);
            // TODO : add the check on the API call jsonp mock is called with query = cathether
          // NOTE how this is desynchronized ? I render and jsonp in the same click? not necessarily render can come
          // after, but on the next click the latest
          // or maybe I should wait for jsonp.spy to be called with sth && forElement. what if the click does not
          // change the DOM, then no forElement detection!! but here not a problem because the screen does change
          // (would it only be because gallery changes)
          // so review the doc for wait and use that, imitating forElement (look code if necessary)
          }
        );
    },
    // { SEARCH_SUCESS: [{link, m}] -->       [null, { command: "render" }],
    "SEARCH_SUCCESS": (component, anchor, rtl, eventData, expectedOutput) => {
      const eventName = "SEARCH_SUCCESS";
      const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
      // TODO : here I need to simulate sending a system event... HOW??
      // NOTE: System events cannot be simulated at this level (will be sent by mocked command handlers)
      // but they can be analyzed through their effect on the DOM. If they would be none, then we are f...ed
      // Anyways, here, an API call will send some data which will lead to the render, so we just wait for a render
      fireEvent.click(getByTestId(SEARCH));
      // NOTE : we wait for a mutation to the DOM.
      // If no event, no DOM mutation, if DOM changed, something happened, we checked what happened is what is expected
      return waitForElement(() => true)
        .then(() => {
            const actualOutput = prettyDOM(baseElement);
            assert.deepEqual(actualOutput, expectedOutput, `ok with : ${prettyFormat({ [eventName]: eventData })}`);
          }
        );
      // .catch()
    },
    "SEARCH_FAILURE": void 0,
    "CANCEL_SEARCH": void 0,
    "SELECT_PHOTO": void 0,
    "EXIT_PHOTO": void 0
  };
  // TODO : but for now solve the regenerator runtime because of async/webpack/babel...
  assert.expect( inputSequence.length );
  const done = assert.async(inputSequence.length);

  inputSequence.reduce((acc, input, index) => {
    const eventName = Object.keys(input)[0];
    const eventData = input[eventName];
    const assertion = assertions[eventName];

    return acc
      .then(() => assertion(imageGallery, anchor, rtl, eventData, expectedOutputSequence[index]))
      .then(done)
    // TODO : nice error messages...
  }, Promise.resolve());

  // Contracts
  // All assertion specs run exactly ONE assert (otherwise the counting is wrong... That is annoying
  // Assertions do not necessarily have to return a promise
  // TODO : case when the event name is not in the assertion config.
  // TODO : refactor this is hard to follow right now
});

