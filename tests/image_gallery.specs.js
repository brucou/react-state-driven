import React from "react";
import {
  cleanup, fireEvent, getAllByTestId, getByLabelText, getByTestId, queryByTestId, render, wait, waitForElement, within
} from "react-testing-library";
import { create_state_machine, decorateWithEntryActions, INIT_EVENT } from "state-transducer";
import { COMMAND_RENDER, Machine } from "../src";
import { applyJSONpatch, checkOutputs, mock, noop, normalizeHTML, stateTransducerRxAdapter } from "./helpers";
import { testCases } from "./assets/test-generation";
import prettyFormat from "pretty-format";
import { imageGallerySwitchMap } from "./fixtures/machines";
import { CANCEL_SEARCH, PHOTO, PHOTO_DETAIL, SEARCH, SEARCH_ERROR, SEARCH_INPUT } from "./fixtures/test-ids";
import HTML from "html-parse-stringify";
import { COMMAND_SEARCH } from "../src/properties";
import sinon from "../node_modules/sinon/pkg/sinon-esm.js";


// NOTE : this is coupled to index.html
const container = document.getElementById("app");
const { parse, stringify } = HTML;

QUnit.module("Testing image gallery component", {
  beforeEach: () => {
    // document.getElementById('app').innerHTML = ''; // done by cleanup
  },
  afterEach: () => {
    // Remove react tree (otherwise further rendering will diff against wrong tree)
    // For some reasons, the recommended way to do this (`cleanup`) fails on some specific tests
    cleanup();
    // render(null, { container: document.getElementById('app') });

    // Restore the default sandbox cf. https://sinonjs.org/releases/v7.1.1/general-setup/
    sinon.restore();
  },
  after : () => {
    // We call cleanup here, because we haven\t called it before because of abovementioned bug
    // That way we still free resources and avoid possible memory leaks
    cleanup();
  }
});

// Test config
const when = {
  [INIT_EVENT]: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;

    render(component, { container: anchor });
    return waitForElement(() => true);
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
    return waitForElement(() => getByTestId(container, PHOTO))
    // !! very important for the edge case when the search success is the last to execute.
    // Because of react async rendering, the DOM is not updated yet, that or some other reason anyways
    // Maybe the problem is when the SECOND search success arrives, there already are elements with testid photo, so
    // the wait does not happen, so to actually wait I need to explicitly wait... maybe
      .then(()=> wait(() => true));
  },
  SEARCH_FAILURE: (testHarness, testCase, component, anchor) => {
    return waitForElement(() => getByTestId(container, SEARCH_ERROR));
  },
  SELECT_PHOTO: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    const item = eventData;
    // find the img to click
    const photos= getAllByTestId(container, PHOTO);
    const photoToClick = photos.find(photoEl =>  photoEl.src === item.media.m);

    fireEvent.click(photoToClick);
    // Wait a tick defensively. Not strictly necessary as, by implementation of test harness, expectations are delayed
    return waitForElement(() => getByTestId(container, PHOTO_DETAIL));
  },
  EXIT_PHOTO: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    const photoToClick= getByTestId(container, PHOTO_DETAIL);
    fireEvent.click(photoToClick);

    // Wait a tick defensively. Not strictly necessary as, by implementation of test harness, expectations are delayed
    return waitForElement(() => true);
  },
  CANCEL_SEARCH: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    fireEvent.click(getByTestId(container, CANCEL_SEARCH));

    return wait(() => !queryByTestId(container, CANCEL_SEARCH));
  },
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
    TWO_SEARCHES_NO_FAILURES: {
      runSearchQuery: effectHandlers => {
        return sinon.stub(effectHandlers, "runSearchQuery").callsFake(imageGallerySwitchMap.mocks.runSearchQuery(0,0));
      }
    },
    TWO_SEARCHES_S2_1_FAILURES: {
      runSearchQuery: effectHandlers => {
      return sinon.stub(effectHandlers, "runSearchQuery").callsFake(imageGallerySwitchMap.mocks.runSearchQuery(0,1));
    }},
    TWO_SEARCHES_S2_2_FAILURES: {
      runSearchQuery: effectHandlers => {
      return sinon.stub(effectHandlers, "runSearchQuery").callsFake(imageGallerySwitchMap.mocks.runSearchQuery(0,2));
    }},
    TWO_SEARCHES_S1_1_S2_1_FAILURES: {
      runSearchQuery: effectHandlers => {
      return sinon.stub(effectHandlers, "runSearchQuery").callsFake(imageGallerySwitchMap.mocks.runSearchQuery(1,1));
    }},
    TWO_SEARCHES_S1_2_FAILURES: {
      runSearchQuery: effectHandlers => {
      return sinon.stub(effectHandlers, "runSearchQuery").callsFake(imageGallerySwitchMap.mocks.runSearchQuery(2,0));
    }},
    TWO_SEARCHES_S1_1_FAILURES: {
      runSearchQuery: effectHandlers => {
      return sinon.stub(effectHandlers, "runSearchQuery").callsFake(imageGallerySwitchMap.mocks.runSearchQuery(1,0));
    }}
  }
};

function getMockCategory(inputSequence){
  const FIRST_SEARCH = 'cathether';
  const SECOND_SEARCH = 'cat';
  const [s1Failures, s2Failures] = inputSequence.reduce((acc, input)=>{
    let [s1Failures, s2Failures, lastSearch] = acc;
    const eventName = Object.keys(input)[0];
    const eventData = input[eventName];

    if (eventName === 'SEARCH'){
      lastSearch = eventData;
    }
    if (eventName === 'SEARCH_FAILURE'){
      lastSearch === FIRST_SEARCH ? s1Failures++ : s2Failures++
    }

    return [s1Failures, s2Failures, lastSearch]
  }, [0,0, null]);

  const choiceTable = {
    '00' : 'TWO_SEARCHES_NO_FAILURES',
    '10' : 'TWO_SEARCHES_S1_1_FAILURES',
    '20' : 'TWO_SEARCHES_S1_2_FAILURES',
    '01' : 'TWO_SEARCHES_S2_1_FAILURES',
    '02' : 'TWO_SEARCHES_S2_2_FAILURES',
    '11' : 'TWO_SEARCHES_S1_1_S2_1_FAILURES',
  };

  return choiceTable[""+s1Failures+s2Failures]
}

testCases.slice(0, 2).forEach(testCase => { // This is to test only a slice on the test scenarii
// testCases.forEach(testCase => {
  QUnit.test(`${testCase.controlStateSequence.join(" -> ")}`, function exec_test(assert) {
    const rtl = { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText };
    const inputSequence = testCase.inputSequence;
    const mockCategory = getMockCategory(inputSequence);
    // NOTE : by construction of the machine, length of input and output sequence are the same!!
    const expectedFsmOutputSequence = testCase.outputSequence;
    const expectedOutputSequence = expectedFsmOutputSequence;
    const machine = imageGallerySwitchMap;
    const fsmSpecsWithEntryActions = decorateWithEntryActions(machine, machine.entryActions, null);
    const fsm = create_state_machine(fsmSpecsWithEntryActions, { updateState: applyJSONpatch });
    const mockedEffectHandlers = mock(machine.effectHandlers, mocks, mockCategory, "imageGallerySwitchMap");

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
      const testCase = {
        eventName,
        eventData,
        expectedOutput: expectedOutputSequence[index],
        inputSequence,
        expectedOutputSequence,
        mockedEffectHandlers,
        when,
        then,
        getMockCategory,
        mocks
      };

      return acc
        .then(() => {
          if (!when[eventName]) throw `Cannot find what to do to simulate event ${eventName}!`;
          if (typeof when[eventName] !== "function") throw `Simulation for event ${eventName} must be defined through a function! Received ${prettyFormat(when[eventName])}`;

          const simulateInput = when[eventName](testHarness, testCase, imageGallery, container);
          if (simulateInput instanceof Promise) {
            return simulateInput
              .then(() => checkOutputs(testHarness, testCase, imageGallery, container, expectedOutputSequence[index]));
          }
          else {
            checkOutputs(testHarness, testCase, imageGallery, container, expectedOutputSequence[index]);
          }
        })
        .then(done)
        .catch((e) => {
          console.log(`Error`, e);
          assert.ok(false, e);
          done(e);
        })
        ;
    }, Promise.resolve());

    // TODO : DOC
  });
});

