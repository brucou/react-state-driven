import ReactDOMServer from "react-dom/server";
import { merge as mergeR, range, omit } from "ramda";
import { computeTimesCircledOn, decorateWithEntryActions, INIT_EVENT, INIT_STATE, NO_OUTPUT } from "kingly";
import { generateTestSequences } from "state-transducer-testing";
import { assertContract, COMMAND_SEARCH, constGen, formatResult, isArrayUpdateOperations } from "./helpers";
import { applyPatch } from "json-patch-es6/lib/duplex";
import { CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE } from "../src/properties";
import { COMMAND_RENDER } from "../src/Machine";
import { imageGallery } from "./fixtures/machines";
// import { filter, flatMap, map, shareReplay, switchMap } from "rxjs/operators";
import { merge as merge$, of, Subject } from "rxjs";
import { searchFixtures } from "./fixtures/fake";

// TODO : I must not only keep the props but also the name of the react component displayed!!!!
// NTH : should also take care of case : fragment, not react component? no name?
export function formatOutputSequence(results) {
  const fakeTrigger = eventName => function fakeEventHandler() {};

  return results.map(result => {
    const { inputSequence, outputSequence, controlStateSequence } = result;
    return {
      inputSequence,
      controlStateSequence,
      outputSequence: outputSequence.map(outputs => {
        return outputs.map(output => {
          if (output === null) return output;
          const { command, params } = output;
          if (command !== "render") return output;

          return {
            command,
            params
          };
        });
      })
    };
  });
}

/**
 *
 * @param {FSM_Model} model
 * @param {Operation[]} modelUpdateOperations
 * @returns {FSM_Model}
 */
function applyJSONpatch(model, modelUpdateOperations) {
  assertContract(isArrayUpdateOperations, [modelUpdateOperations],
    `applyUpdateOperations : ${CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE}`);

  // NOTE : we don't validate operations, to avoid throwing errors when for instance the value property for an
  // `add` JSON operation is `undefined` ; and of course we don't mutate the document in place
  return applyPatch(model, modelUpdateOperations, false, false).newDocument;
}

const default_settings = {
  updateState: applyJSONpatch,
  subject_factory: () => {
    const subject = new Subject();
    // NOTE : this is intended for Rxjs v4-5!! but should work for `most` also
    subject.emit = subject.next || subject.onNext;
    return subject;
  },
  merge: function merge(arrayObs) {return merge$(...arrayObs);},
  of: of
};

QUnit.module("Testing image gallery machine", {});

QUnit.test("image search gallery", function exec_test(assert) {
  const searchQueries = Object.keys(searchFixtures);
  // TODO : move the test generation specs to a stackblitz
  const fsmDef = decorateWithEntryActions(imageGallery, imageGallery.entryActions, null);
  const genFsmDef = {
    transitions: [
      {
        from: INIT_STATE, event: INIT_EVENT, to: "init",
        gen: constGen(void 0, { pending: [], done: [], current: null })
      },
      { from: "init", event: "START", to: "start", gen: constGen(void 0, { pending: [], done: [], current: null }) },
      {
        from: "start", event: "SEARCH", to: "loading",
        gen: constGen(searchQueries[0], { pending: [searchQueries[0]], done: [] })
      },
      {
        from: "loading", event: "SEARCH_SUCCESS", to: "gallery", gen: (extS, genS) => {
          // Assign success to a random query, if any
          const { pending, done } = genS;
          const hasPendingQueries = pending.length !== 0;
          const alea = Math.random();
          const indexSuccessfulQuery = Math.round(alea * (pending.length - 1));
          const input = hasPendingQueries
            ? searchFixtures[pending[indexSuccessfulQuery]]
            : null;
          const generatorState = hasPendingQueries
            // Remove the successful query from the list of pending queries
            ? {
              pending: pending.filter((_, index) => index !== indexSuccessfulQuery),
              done: done.concat(pending[indexSuccessfulQuery]),
              current: pending[indexSuccessfulQuery]
            }
            : genS;

          return { hasGeneratedInput: hasPendingQueries, input, generatorState };
        }
      },
      {
        from: "loading", event: "SEARCH_FAILURE", to: "error", gen: (extS, genS) => {
          const { pending, done } = genS;
          const hasPendingQueries = pending.length !== 0; // should always be true here by construction
          const alea = Math.random();
          const indexErroneousQuery = Math.round(alea * (pending.length - 1));

          return {
            hasGeneratedInput: hasPendingQueries, input: void 0,
            generatorState: {
              pending: pending.filter((_, index) => index !== indexErroneousQuery),
              done: done
            }
          };
        }
      },
      {
        from: "loading", event: "CANCEL_SEARCH", to: "gallery",
        gen: (extS, genS) => {
          // Cancel always relates to the latest search. However that search must remain in the list of pending
          // queries as the corresponding API call is in fact not cancelled
          // We do not repeat the cancelled query and consider it done, and not pending
          const { pending, done } = genS;
          const hasPendingQueries = pending.length !== 0; // should always be true here by construction
          return {
            hasGeneratedInput: hasPendingQueries, input: void 0,
            generatorState: { pending: pending.slice(0, -1), done: done.concat(pending[pending.length - 1]) }
          };
        }
      },
      {
        from: "error", event: "SEARCH", to: "loading", gen: (extS, genS) => {
          // Next query is among the queries, not done, and not pending.
          const { pending, done } = genS;
          const possibleQueries = searchQueries.filter(query => !done.includes(query) && !pending.includes(query));

          return {
            hasGeneratedInput: possibleQueries.length > 0, input: possibleQueries[0],
            generatorState: { pending: pending.concat(possibleQueries[0]), done: genS.done }
          };
        }
      },
      {
        from: "gallery", event: "SEARCH", to: "loading", gen: (extS, genS) => {
          // Next query is the next one in the query search array.
          const { pending, done } = genS;
          const possibleQueries = searchQueries.filter(query => !done.includes(query) && !pending.includes(query));

          return {
            hasGeneratedInput: possibleQueries.length > 0, input: possibleQueries[0],
            generatorState: { pending: pending.concat(possibleQueries[0]), done: genS.done }
          };
        }
      },
      {
        from: "gallery", event: "SELECT_PHOTO", to: "photo", gen: (extS, genS) => {
          // we have four pictures for each query in this test setup. So we just pick one randomly
          // the query for the selected photo is the latest done query
          const { pending, done, current } = genS;
          const indexPhoto = Math.round(Math.random() * 3);
          const query = done[done.length - 1];

          return { hasGeneratedInput: current, input: searchFixtures[query][indexPhoto] };
        }
      },
      { from: "photo", event: "EXIT_PHOTO", to: "gallery", gen: constGen(void 0) }
    ]
  };
  const generators = genFsmDef.transitions;
  const ALL_n_TRANSITIONS_WITH_REPEATED_TARGET = ({ maxNumberOfTraversals, targetVertex }) => ({
    isTraversableEdge: (edge, graph, pathTraversalState, graphTraversalState) => {
      return computeTimesCircledOn(pathTraversalState.path, edge) < (maxNumberOfTraversals || 1);
    },
    isGoalReached: (edge, graph, pathTraversalState, graphTraversalState) => {
      const { getEdgeTarget, getEdgeOrigin } = graph;
      const lastPathVertex = getEdgeTarget(edge);
      // Edge case : accounting for initial vertex
      const vertexOrigin = getEdgeOrigin(edge);

      const isGoalReached = vertexOrigin
        ? lastPathVertex === targetVertex && !(computeTimesCircledOn(pathTraversalState.path, edge) < (maxNumberOfTraversals || 1))
        : false;
      return isGoalReached;
    }
  });
  const strategy = ALL_n_TRANSITIONS_WITH_REPEATED_TARGET({ maxNumberOfTraversals: 2, targetVertex: "gallery" });
  const settings = mergeR({ updateState: applyJSONpatch }, { strategy });
  const results = generateTestSequences(fsmDef, generators, settings);
debugger
  console.log(`results`, formatOutputSequence(results));

  const inputSequences = results.map(result => result.inputSequence);
  const outputsSequences = results.map(x => x.outputSequence);
  const getInputKey = function getInputKey(input) {return Object.keys(input)[0];};
  const formattedInputSequences = inputSequences.map(inputSequence => inputSequence.map(getInputKey));
  const formattedOutputsSequences = outputsSequences
    .map(outputsSequence => {
      return outputsSequence.map(outputs => {
        if (outputs === NO_OUTPUT) return outputs;

        return outputs
          .map(output => {
            if (output === NO_OUTPUT) return output;

            const { command, params } = output;
            if (command === COMMAND_RENDER) {
              return {
                command: command,
                params: omit(['trigger', 'next'], params)
              };
            }
            else {
              return output;
            }
          })
          .map(formatResult);
      });
    });
  const expectedOutputSequences = inputSequences
    .map(inputSequence => {
      return inputSequence.reduce((acc, input) => {
        const assign = Object.assign.bind(Object);
        const defaultProps = { query: "", items: [], photo: undefined, gallery: ""};
        const { outputSeq, state } = acc;
        const { pendingQuery, currentItems, currentPhoto } = state;
        const event = Object.keys(input)[0];
        const eventData = input[event];

        function searchCommand(query) {
          return { "command": COMMAND_SEARCH, "params": {query} };
        }

        switch (event) {
          case INIT_EVENT:
            return acc;
          case "START":
            return {
              outputSeq: outputSeq.concat([
                [null, {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, { gallery: "start" })
                }]
              ]),
              state: { pendingQuery: "", currentItems, currentPhoto }
            };
          case "SEARCH" :
            return {
              outputSeq: outputSeq.concat([
                [null, searchCommand(eventData), {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, {
                    gallery: "loading",
                    items: currentItems,
                    query: eventData,
                    photo: currentPhoto
                  })
                }]
              ]),
              state: { pendingQuery: eventData, currentItems, currentPhoto }
            };
          case "SEARCH_SUCCESS" :
            const items = searchFixtures[pendingQuery];
            if (items) {
              return {
                outputSeq: outputSeq.concat([
                  [null, {
                    command: COMMAND_RENDER,
                    params: assign({}, defaultProps, { gallery: "gallery", items, photo: currentPhoto })
                  }]
                ]),
                state: { pendingQuery: "", currentItems: items, currentPhoto }
              };
            }
            else {
              return {
                outputSeq: outputSeq.concat([null]),
                state: state
              };
            }
          case "SEARCH_FAILURE" :
            return {
              outputSeq: outputSeq.concat([
                [null, {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, { gallery: "error", items: currentItems, photo: currentPhoto })
                }]
              ]),
              state: { pendingQuery: "", currentItems, currentPhoto }
            };
          case "CANCEL_SEARCH" :
            return {
              outputSeq: outputSeq.concat([
                [null, {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, { gallery: "gallery", items: currentItems, photo: currentPhoto })
                }]
              ]),
              state: { pendingQuery: "", currentItems, currentPhoto }
            };
          case "SELECT_PHOTO":
            return {
              outputSeq: outputSeq.concat([
                [null, {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, { gallery: "photo", items: currentItems, photo: eventData })
                }]
              ]),
              state: { pendingQuery: "", currentItems, currentPhoto: eventData }
            };
          case "EXIT_PHOTO" :
            return {
              outputSeq: outputSeq.concat([
                [null, {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, { gallery: "gallery", items: currentItems, photo: currentPhoto })
                }]
              ]),
              state: { pendingQuery: "", currentItems, currentPhoto }
            };
          default :
            throw `unknow event??`;
        }

      }, { outputSeq: [], state: { pendingQuery: "", currentItems: [], currentPhoto: undefined } });
    })
    .map(x => x.outputSeq);

  // NOTE: I am testing the application here, with the assumption that the test generation is already tested
  // So no need to test the input sequence (neither the control state sequence actually
  // What we have to test is that the (actual) ouptutSequence correspond to what we would compute otherwise
  range(0, inputSequences.length - 1).forEach(index => {
    assert.deepEqual(
      formattedOutputsSequences[index],
      expectedOutputSequences[index],
      formattedInputSequences[index].join(" -> ")
    );
  });
});

