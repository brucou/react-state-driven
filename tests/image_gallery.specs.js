import React from "react";
import {
  fireEvent, getByLabelText, getByTestId, queryByTestId, render, wait, waitForElement, within
} from "react-testing-library";
import { create_state_machine, decorateWithEntryActions, INIT_EVENT, NO_OUTPUT } from "state-transducer";
import { COMMAND_RENDER, Machine } from "../src";
import { applyJSONpatch, checkOutputs, mock, noop, normalizeHTML, stateTransducerRxAdapter } from "./helpers";
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

// Test config
const when = {
  [INIT_EVENT]: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;

    render(component, { container: anchor });
  },
  SEARCH: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    const query = eventData;

    fireEvent.change(getByTestId(container, SEARCH_INPUT), { target: { value: query } });
    fireEvent.submit(getByTestId(container, SEARCH));
  },
  SEARCH_SUCCESS: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;

    // NOTE: System events are sent by mocked effect handlers (here the API call). On receiving the search response, the
    // rendering happens asynchronously, so we need to wait a little to get the updated DOM. It is also possible
    // that the DOM is not updated (because the new DOM is exactly as the old DOM...). The less error-prone way is
    // to just wait `n > 1` tick (that should be enough for React to render) and to read the DOM then. No events
    // will be received during those `n` ticks to be sure that React had the time to update the DOM.
    // Those time-dependencies are tricky in theory. However, in practice most of the time, heuristics like the one
    // we just described suffice.
    // Note that because we anyways chain assertions with promises, we naturally wait a tick between assertions, so
    // we could have done away with the `waitForElement`. For clarity purposes, we however let it be visible.
    return waitForElement(() => true);
  }
};
const then = {
  [COMMAND_RENDER]: (testHarness, testCase, component, anchor, output) => {
    const { command, params } = output;
    const { assert, rtl } = testHarness;
    const { eventName, eventData, mockedEffectHandlers } = testCase;

    const actualOutput = normalizeHTML(anchor.innerHTML);
    const expectedOutput = normalizeHTML(params);
    assert.deepEqual(actualOutput, expectedOutput, `Correct render when : ${prettyFormat({ [eventName]: eventData })}`);
  },
  [COMMAND_SEARCH]: (testHarness, testCase, component, anchor, output) => {
    const { assert, rtl } = testHarness;
    const { eventName, eventData, mockedEffectHandlers } = testCase;
    const query = eventData;

    assert.ok(mockedEffectHandlers.runSearchQuery.calledWithExactly(query), `Search query '${query}' made when : ${prettyFormat({ [eventName]: eventData })}`);
  }
};
const mocks = {
  imageGallerySwitchMap: {
    runSearchQuery: effectHandlers => {
      return sinon.stub(effectHandlers, "runSearchQuery").callsFake(imageGallerySwitchMap.mocks.runSearchQuery);
    }
  }
};

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
    const testHarness = { assert, rtl };
    const testCase = { eventName, eventData, expectedOutput: expectedOutputSequence[index], mockedEffectHandlers, when, then, mocks };

    return acc
      .then(() => {
        const simulateInput = when[eventName](testHarness, testCase, imageGallery, container);

        if (simulateInput instanceof Promise) {
          return simulateInput
            .then(() => checkOutputs(testHarness, testCase, imageGallery, container, expectedOutputSequence[index]));
        }
        else {
          checkOutputs(testHarness, testCase, imageGallery, container, expectedOutputSequence[index]);
        }
      })
      .then(done);
  }, Promise.resolve());

  // TODO : error management...
  // TODO : case when the event name is not in the assertion config.
  // TODO : refactor this is hard to follow right now
  // TODO : do not forget after each and before cleaning : https://sinonjs.org/releases/v7.1.1/general-setup/
  // TODO : solve the problem of INIT EVENT not appearing in the input list...
  // TODO : DOC
});

