import React from "react";
import {
  cleanup, fireEvent, getAllByTestId, getByLabelText, getByTestId, queryByTestId, render, wait, waitForElement, within
} from "react-testing-library";
import { createStateMachine, decorateWithEntryActions, INIT_EVENT } from "state-transducer";
import { COMMAND_RENDER, Machine } from "../src";
import { applyJSONpatch, noop, normalizeHTML } from "./helpers";
import prettyFormat from "pretty-format";
import { imageGallery } from "./fixtures/machines";
import { CANCEL_SEARCH, PHOTO, PHOTO_DETAIL, SEARCH, SEARCH_ERROR, SEARCH_INPUT } from "./fixtures/test-ids";
import { COMMAND_SEARCH } from "../src/properties";
import sinon from "sinon";
import { testCases } from "./assets/test-generation";
import { testMachineComponent } from "../src/Machine";

// NOTE : this is coupled to index.html
const container = document.getElementById("app");

QUnit.module("Testing image gallery component", {
  // Restore the default sandbox cf. https://sinonjs.org/releases/v7.1.1/general-setup/
  beforeEach: () => {
    // document.getElementById('app').innerHTML = ''; // done by cleanup
  },
  afterEach: () => {
    // Remove react tree (otherwise further rendering will diff against wrong tree)
    // For some reasons, the recommended way to do this (`cleanup`) fails on some specific tests
    // cleanup();
    render(null, { container: document.getElementById("app") });

    // Restore sinon state - avoid memory leaks
    sinon.restore();
  },
  after: () => {
    // We call cleanup here, because we haven\t called it before because of abovementioned bug
    // That way we still free resources and avoid possible memory leaks
    cleanup();
  }
});

// Test config
const testAPI = {
  sinonAPI: sinon,
  test: QUnit.test.bind(QUnit),
  rtl: { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText },
  debug:{console}
};
const when = {
  [INIT_EVENT]: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;

    render(component, { container: anchor });
    return waitForElement(() => true, {timeout: 1000});
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
    // that the DOM is not updated (because the new DOM is exactly as the old DOM...). So we can't really use
    // predictably a set amount of time to wait. The best robust way to know when to run this assertion is to
    // observe the appearance of new elements, which is what we do here. Still...
    // we have to be careful about time dependencies. This will wait for new DOM elements appearing which satisfy
    // the condition. STARTING FROM the moment of the wait call. So the wait call must happen before the screen is
    // updated, otherwise it waits forever (i.e. the duration of the timeout).  This in turns means the related
    // input simulation must not wait too long before passing the relay to the assertion section...
    return waitForElement(() => getByTestId(container, PHOTO), {timeout: 1000})
    // !! very important for the edge case when the search success is the last to execute.
    // Because of react async rendering, the DOM is not updated yet, that or some other reason anyways
    // Maybe the problem is when the SECOND search success arrives, there already are elements with testid photo, so
    // the wait does not happen, so to actually wait I need to explicitly wait... maybe
      .then(() => wait(() => true));
  },
  SEARCH_FAILURE: (testHarness, testCase, component, anchor) => {
    return waitForElement(() => getByTestId(container, SEARCH_ERROR), {timeout: 1000});
  },
  SELECT_PHOTO: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    const item = eventData;
    // find the img to click
    const photos = getAllByTestId(container, PHOTO);
    const photoToClick = photos.find(photoEl => photoEl.src === item.media.m);

    fireEvent.click(photoToClick);
    // Wait a tick defensively. Not strictly necessary as, by implementation of test harness, expectations are delayed
    return waitForElement(() => getByTestId(container, PHOTO_DETAIL));
  },
  EXIT_PHOTO: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    const photoToClick = getByTestId(container, PHOTO_DETAIL);
    fireEvent.click(photoToClick);

    // Wait a tick defensively. Not strictly necessary as, by implementation of test harness, expectations are delayed
    return waitForElement(() => true, {timeout: 1000});
  },
  CANCEL_SEARCH: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    fireEvent.click(getByTestId(container, CANCEL_SEARCH));

    return wait(() => !queryByTestId(container, CANCEL_SEARCH));
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
  runSearchQuery: function getMockedSearchQuery(inputSequence) {
    const FIRST_SEARCH = "cathether";
    const SECOND_SEARCH = "cat";
    const [s1Failures, s2Failures] = inputSequence.reduce((acc, input) => {
      let [s1Failures, s2Failures, lastSearch] = acc;
      const eventName = Object.keys(input)[0];
      const eventData = input[eventName];

      if (eventName === "SEARCH") {
        lastSearch = eventData;
      }
      if (eventName === "SEARCH_FAILURE") {
        lastSearch === FIRST_SEARCH ? s1Failures++ : s2Failures++;
      }

      return [s1Failures, s2Failures, lastSearch];
    }, [0, 0, null]);
    let s1 = s1Failures, s2 = s2Failures;

    // The way the input sequence is constructed, any search who fails would fails first before succeeding. So we
    // know implicitly when the failure occurs : at the beginning. I guess we got lucky. That simplifies the mocking.

    return function mockedSearchQuery(query) {
      // NOTE : this is coupled to the input event in `test-generation.js`. Those values are later a part of the
      // API call response
      return new Promise((resolve, reject) => {
        if (query === FIRST_SEARCH) {
          s1--;
          s1 >= 0
            ? setTimeout(() => reject(void 0), 2)
            : setTimeout(() => resolve({
              items: [
                {
                  link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
                  media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
                  media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
                  media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
                  media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
                }
              ]
            }), 2);
        }
        else if (query === SECOND_SEARCH) {
          s2--;
          s2 >= 0
            ? setTimeout(() => reject(void 0), 2)
            : setTimeout(() => resolve({
              items: [
                {
                  link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
                  media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
                  media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
                  media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
                  media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
                }
              ]
            }), 2);
        }
        else {
          reject(new Error(`no mock defined for the query ${query}`));
        }
      });
    };

  }
};

function mockedMachineFactory(machine, mockedEffectHandlers) {
  const fsmSpecsWithEntryActions = decorateWithEntryActions(machine, machine.entryActions, null);
  const fsm = createStateMachine(fsmSpecsWithEntryActions, { updateState: applyJSONpatch, debug : {console} });

  return React.createElement(Machine, {
    fsm: fsm,
    renderWith : machine.renderWith,
    options : machine.options,
    eventHandler: machine.eventHandler,
    preprocessor: machine.preprocessor,
    effectHandlers: mockedEffectHandlers,
    commandHandlers: machine.commandHandlers
  }, null);
}

const testScenario = { testCases: testCases, mocks, when, then, container, mockedMachineFactory };

testMachineComponent(testAPI, testScenario, imageGallery);
