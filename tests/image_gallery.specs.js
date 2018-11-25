import React from "react";
import {
  fireEvent, getByLabelText, getByTestId, queryByTestId, render, wait, waitForElement, within
} from "react-testing-library";
import { create_state_machine, decorateWithEntryActions, INIT_EVENT, NO_OUTPUT } from "state-transducer";
import { COMMAND_RENDER, Machine } from "../src";
import { applyJSONpatch, noop, normalizeHTML, prettyDOM, stateTransducerRxAdapter } from "./helpers";
import { testCases } from "./assets/test-generation";
import prettyFormat from "pretty-format";
import { imageGallerySwitchMap } from "./fixtures/machines";
import { SEARCH, SEARCH_INPUT } from "./fixtures/test-ids";
import HTML from "html-parse-stringify";
import { COMMAND_SEARCH } from "../src/properties";
import sinon from "../node_modules/sinon/pkg/sinon-esm.js";


// NOTE : this is coupled to index.html
const container = document.getElementById("app");
const { parse, stringify } = HTML;

export function forEachOutput(expectedOutput, fn) {
  if (!expectedOutput) return void 0;

  expectedOutput.forEach((output, index) => {
    if (output === NO_OUTPUT) return void 0;
    fn(output, index);
  });
}

QUnit.module("Testing image gallery component", {
  // afterEach : cleanup
});
// TODO : make a loop on testCase with Qunit test inside
let testCase;

// ["nok", "start", "loading", "gallery", "loading", "gallery"]
testCase = testCases[0];
const assertions = {
  // {[INIT_EVENT]: ..} -> [null, { command: "render" }],
  // TODO : refactor in testFramework (assert, rtl); testCase (component, eventData->handlers), anchor
  [INIT_EVENT]: (assert, component, anchor, rtl, eventData, expectedOutput, mockedEffectHandlers) => {
    const eventName = INIT_EVENT;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;

    const { baseElement, container, rerender, asFragment } = render(component, { container: anchor });
    forEachOutput(expectedOutput, output => {
      const { command, params } = output;
      if (command === COMMAND_RENDER) {
        const actualOutput = normalizeHTML(anchor.innerHTML);
        const expectedOutput = normalizeHTML(params);
        assert.deepEqual(actualOutput, expectedOutput, `ok with : ${prettyFormat({ [eventName]: eventData })}`);
      }
      else {
        throw `assertions > [INIT_EVENT] > forEachOutput :: unexpected command for this scenario : ${command}`;
      }
    });
  },
  // { SEARCH: "cathether" } --> [null, { command: "command_search", params: "cathether" }, { command: "render" }],
  "SEARCH": (assert, component, anchor, rtl, eventData, expectedOutput, mockedEffectHandlers) => {
    const eventName = SEARCH;
    const query = eventData;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;

    fireEvent.change(getByTestId(container, SEARCH_INPUT), { target: { value: query } });
    fireEvent.submit(getByTestId(container, SEARCH));
    forEachOutput(expectedOutput, output => {
      const { command, params } = output;
      if (command === COMMAND_RENDER) {
        const expectedOutput = normalizeHTML(params);
        const actualOutput = normalizeHTML(anchor.innerHTML);
        assert.deepEqual(actualOutput, expectedOutput, `command ${command} : ${prettyFormat({ [eventName]: eventData })}`);
      }
      else if (command === COMMAND_SEARCH) {
        assert.ok(mockedEffectHandlers.runSearchQuery.calledWithExactly(query), `Query (${query}) made`);
      }
      else {
        throw `assertions > [SEARCH] > forEachOutput :: unexpected command for this scenario : ${command}`;
      }
    });
    // NOTE: the timing here is paramount. We have to execute our asserts in the same tick than the click. This
    // ensures that the screen is not updated yet (React.setState is asynchronous).
    return Promise.resolve()
  },
  // { SEARCH_SUCESS: [{link, m}] -->       [null, { command: "render" }],
  "SEARCH_SUCCESS": (assert, component, anchor, rtl, eventData, expectedOutput, mockedEffectHandlers) => {
    const eventName = "SEARCH_SUCCESS";
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    // NOTE: System events are sent by mocked effect handlers (here the API call). On receiving the search response, the
    // rendering happens asynchronously, so we need to wait a little to get the updated DOM. It is also possible
    // that the DOM is not updated (because the new DOM is exactly as the old DOM...). The less error-prone way is
    // to just wait a tick (that should be enough for React to render) and to read the DOM then. It is also possible
    // to wait `n` ticks, as no events will be received during those `n` ticks to be sure that React had the time to
    // update the DOM.
    // Those time-dependencies are tricky in theory. However, in practice most of the time, heuristics like the one
    // we just described suffice.
    return waitForElement(() => true)
      .then(() => {
        forEachOutput(expectedOutput, output => {
          const { command, params } = output;
          if (command === COMMAND_RENDER) {
            const expectedOutput = normalizeHTML(params);
            const actualOutput = normalizeHTML(anchor.innerHTML);
            assert.deepEqual(actualOutput, expectedOutput, `command ${command} : ${prettyFormat({ [eventName]: eventData })}`);
          }
          else {
            throw `assertions > [SEARCH_SUCCESS] > forEachOutput :: unexpected command for this scenario : ${command}`;
          }
        });
        }
      );
    // .catch()
  },
  "SEARCH_FAILURE": void 0,
  "CANCEL_SEARCH": void 0,
  "SELECT_PHOTO": void 0,
  "EXIT_PHOTO": void 0
};
const mocks = {
  imageGallerySwitchMap: {
    runSearchQuery: effectHandlers => {
      return sinon.stub(effectHandlers, "runSearchQuery").callsFake(imageGallerySwitchMap.mocks.runSearchQuery);
    }
  }
};

/** effectHandlers OUT */
function mock(effectHandlers, mocks, id) {
  const clonedHandlers = Object.assign({}, effectHandlers);
  const mock = mocks[id];
  const effects = Object.keys(clonedHandlers);
  effects.forEach(effect => mock[effect](effectHandlers));

  return effectHandlers;
}

QUnit.test(`${testCase.controlStateSequence.join(" -> ")}`, function exec_test(assert) {
  const rtl = { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText };
  let actualOutputSequence = [];
  const inputSequence = testCase.inputSequence;
  // NOTE : by construction of the machine, length of input and output sequence are the same!!
  const expectedFsmOutputSequence = testCase.outputSequence;
  const expectedOutputSequence = expectedFsmOutputSequence;
  const machine = imageGallerySwitchMap;
  const fsmSpecsWithEntryActions = decorateWithEntryActions(machine, machine.entryActions, null);
  const fsm = create_state_machine(fsmSpecsWithEntryActions, { updateState: applyJSONpatch });
  const mockedEffectHandlers = mock(machine.effectHandlers, mocks, "imageGallerySwitchMap");

  const imageGallery = React.createElement(Machine, {
    eventHandler: stateTransducerRxAdapter,
    preprocessor: machine.preprocessor,
    fsm: fsm,
    effectHandlers: mockedEffectHandlers,
    commandHandlers: machine.commandHandlers,
    componentWillUpdate: (machine.componentWillUpdate || noop)(machine.inject),
    componentDidUpdate: (machine.componentDidUpdate || noop)(machine.inject)
  }, null);

  const done = assert.async(inputSequence.length);

  inputSequence.reduce((acc, input, index) => {
    const eventName = Object.keys(input)[0];
    const eventData = input[eventName];
    const assertion = assertions[eventName];

    return acc
      .then(() => assertion &&
        assertion(assert, imageGallery, container, rtl, eventData, expectedOutputSequence[index], mockedEffectHandlers)
      )
      .then(done);
    // TODO : nice error messages...
  }, Promise.resolve());

  // Contracts
  // All assertion specs run exactly ONE assert (otherwise the counting is wrong... That is annoying
  // Assertions do not necessarily have to return a promise
  // TODO : case when the event name is not in the assertion config.
  // TODO : refactor this is hard to follow right now
});

