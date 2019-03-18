import React, { Component } from "react";
import { NO_OUTPUT } from "state-transducer";
import {
  COMMAND_HANDLER_INPUT_STAGE, COMMAND_HANDLER_OUTPUT_STAGE, COMMAND_HANDLERS_OUTPUT_STAGE, COMMAND_RENDER,
  COMPLETE_STAGE, emptyConsole, ERROR_STAGE, FSM_INPUT_STAGE, FSM_OUTPUT_STAGE, IFRAME_CONNECT_TIMEOUT, IFRAME_DEBUG_URL
} from "./properties";
import Penpal from "penpal";
import { identity, logAndRethrow, tryCatch } from "./helpers";

const EVENT_HANDLER_API_NEXT_ERR = `An error occurred while using the 'next' function defined in event handler component prop!`;
const EVENT_HANDLER_API_SUBJECT_FACTORY_ERR = `An error occurred while using the 'subjectFactory' function defined in event handler component prop!`;
const EVENT_HANDLER_API_ERROR_ERR = `An error occurred while using the 'error' function defined in event handler component prop!`;
const EVENT_HANDLER_API_COMPLETE_ERR = `An error occurred while using the 'complete' function defined in event handler component prop!`;
const EVENT_HANDLER_API_SUBSCRIBE_ERR = `An error occurred while using the 'subscribe' function defined in event handler component prop!`;
const COMMAND_HANDLER_EXEC_ERR = command => `An error occurred while executing command handler for command ${command}`;
const PREPROCESSOR_EXEC_ERR = `An error occurred while executing the preprocessor configured for your <Machine/> component!`;
const FSM_EXEC_ERR = `An error occurred while executing the state machine configured for your <Machine/> component!`;
const SIMULATE_INPUT_ERR = `An error occurred while simulating inputs when testing a <Machine/> component!`;

function flattenStreamOfArrays(streamAPI) {
  return streamAPI.concatMap(arr =>
    streamAPI.create(o => {
      arr.forEach(val => o.next(val));
      o.complete();
    })
  );
}

// TODO : write that with subscribe and compose
// TODO : might have to write a concatMap transducer...
function setDebugEmitter(eventHandler, Penpal) {
  const { subjectFactory, next, error, complete, subscribe, transduce } = eventHandler;
  const debugEmitter = subjectFactory();
  const connection = Penpal.connectToChild({
    timeout: IFRAME_CONNECT_TIMEOUT,
    // TODO : url
    // URL of page to load into iframe.
    url: IFRAME_DEBUG_URL,
    // Container to which the iframe should be appended.
    appendTo: document.body,
    // Methods parent is exposing to child
    methods: {}
  });
  // NOTE : we are not using `scan` to reduce the API footprint, and do it through ugly closures
  // We could do the messaging logic with a state machine, but we do not want to load up 8Kb for such
  // a simple logic
  let isFrameReady = false;
  let isChildReadyToReceive = true;
  let childPendingToSend = [];
  let child = null;
  let buffer = [];

  connection.promise.then(_child => {
    (isFrameReady = true), (child = _child);
  });
  debugEmitter
  // TODO : change that to a single obseervable.create, that is all I need
    .pipe(
      map(val => {
        if (isFrameReady && buffer.length !== 0) {
          // Empty the buffer
          const copiedBuffer = buffer.slice(0);
          buffer = [];
          return copiedBuffer;
        } else if (isFrameReady && buffer.length === 0) {
          return [val];
        } else if (!isFrameReady) {
          buffer.push(val);
          return null;
        }
      }),
      filter(Boolean),
      // NOTE : trick to flatten the array of actions into the stream
      // while still keeping order of execution of actions
      flattenStreamOfArrays(eventHandler),
      map(val => {
        if (isChildReadyToReceive && childPendingToSend.length !== 0) {
          // Empty the buffer
          const copiedBuffer = childPendingToSend.slice(0);
          childPendingToSend = [];
          return copiedBuffer;
        } else if (isChildReadyToReceive && childPendingToSend.length === 0) {
          return [val];
        } else if (!isChildReadyToReceive) {
          childPendingToSend.push(val);
          return null;
        }
      }),
      filter(Boolean),
      flattenStreamOfArrays(eventHandler),
      // NOTE : simulates tap(fn) or do(fn), without having to require the function in the API
      concatMap(val => {
        isChildReadyToReceive = false;
        return child.receive(val);
      })
    )
    .subscribe(
      wellReceived => {
        isChildReadyToReceive = true;
      },
      error => {
        isChildReadyToReceive = true;
        console.error(`Machine > componentDidMount > debug emitter :`, error);
      },
      () => {
        isChildReadyToReceive = true;
      }
    );

  return { debugEmitter, connection };
}

const defaultRenderHandler = function defaultRenderHandler(machineComponent, renderWith, params, next) {
  return machineComponent.setState(
    { render: React.createElement(renderWith, Object.assign({}, params, { next }), []) },
    params.callback
  );
};

/**
 * Class implementing a reactive system modelled by a state machine (fsm).
 * The system behaviour is determined by properties passed at construction time :
 * - `preprocessor` : translate user events and system events into machine events
 * - `fsm` : fsm
 * - `commandHandlers` : maps commands output by the fsm to the function executing those commands
 * TODO : finish : effectHandlers, the eventHandling API, the renderWith
 * DOC : callback for the react default render function in options
 */
export class Machine extends Component {
  constructor(props) {
    super(props);
    this.state = { render: null };
    this.rawEventSource = null;
    this.debugEmitter = null;
    this.subscription = null;
    this.finalizeDebugEmitter = null;
  }

  // TODO : put the renderWith as a child <Machine> <Gallery/> </Machine> in new version. Not now because would have to
  // handle fragments (props.children can have more than one element)
  // TODO : do that, adjust codesandbox and react-movie-app-state-driven-bis and release 1.0
  // TODO : error flows to handle also -> pass to the debug emitter!!

  componentDidMount() {
    const machineComponent = this;
    assertPropsContract(machineComponent.props);

    const { fsm: _fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, options, children }
      = machineComponent.props;
    // Two cases a priori :
    // - only one Element
    // - only one Fragment with several element
    // TODO: in later version, error if children.length > 1
    const renderWith = children[0];
    const initialEvent = options && options.initialEvent;
    const debug = options && options.debug || null;
    const traceFactory = debug && debug.traceFactory || null;
    const console = debug && debug.console || emptyConsole;
    // Wrapping the user-provided API with tryCatch to detect error early
    const wrappedEventHandlerAPI = {
      subjectFactory: tryCatch(
        eventHandler.subjectFactory,
        logAndRethrow(debug, EVENT_HANDLER_API_SUBJECT_FACTORY_ERR)
      )
    };
    const wrappedFsm = tryCatch(_fsm, logAndRethrow(debug, FSM_EXEC_ERR));
    // DOC : a subject factory returns a subject which has {next, error, complete} signature
    // subscribe is a function which takes an observable and an observer and returns a subscription
    // a subject should also be possible to use as argument to subscribe
    const { subjectFactory } = wrappedEventHandlerAPI;
    this.rawEventSource = subjectFactory();
    const next = tryCatch(this.rawEventSource.next.bind(this.rawEventSource), logAndRethrow(debug, EVENT_HANDLER_API_NEXT_ERR));

    // We need internal references for cleaning up purposes
    const {constructor, destructor} = traceFactory;
    const debugEmitter = this.debugEmitter = constructor();
    this.finalizeDebugEmitter = destructor;

    const commandHandlersWithRenderHandler = Object.assign({}, commandHandlers, {
      [COMMAND_RENDER]: function renderHandler(next, params, effectHandlersWithRender) {
        effectHandlersWithRender[COMMAND_RENDER](machineComponent, renderWith, params, next);
      }
    });

    const effectHandlersWithRender =
      effectHandlers && effectHandlers[COMMAND_RENDER]
        ? effectHandlers
        : Object.assign({ [COMMAND_RENDER]: defaultRenderHandler }, effectHandlers);

    const preprocessedEventSource = tryCatch(preprocessor || identity, logAndRethrow(debug, PREPROCESSOR_EXEC_ERR))(
      this.rawEventSource
    );

    this.subscription = preprocessedEventSource.subscribe({
        next: event => {
          // 1. Run the input on the machine to obtain the actions to perform
          debugEmitter && debugEmitter.next({ stage: FSM_INPUT_STAGE, value: event });
          const actions = wrappedFsm(event);
          debugEmitter && debugEmitter.next({ stage: FSM_OUTPUT_STAGE, value: actions });

          // 2. Execute the actions, if any
          // DOC:  next must be synchronous, and guarantee conservation of ordering
          if (actions === NO_OUTPUT) {return void 0;}
          else {
            const filteredActions = actions.filter(action => action !== NO_OUTPUT);
            filteredActions.forEach(action => {
              const { command, params } = action;

              debugEmitter && debugEmitter.next({ stage: COMMAND_HANDLER_INPUT_STAGE, value: action });

              const commandHandler = commandHandlersWithRenderHandler[command];
              if (!commandHandler || typeof commandHandler !== "function") {
                throw new Error(
                  `Machine > commandHandlerFactory > globalCommandHandler : Could not find command handler for command ${command}!`
                );
              }

              const commandHandlerReturnValue = tryCatch(
                commandHandler,
                logAndRethrow(debug, COMMAND_HANDLER_EXEC_ERR(command))
              )(next, params, effectHandlersWithRender);

              // NOTE : generally command handlers won't return values synchronously
              // It is however possible and we should trace that
              debugEmitter && debugEmitter.next({
                stage: COMMAND_HANDLER_OUTPUT_STAGE,
                value: { command: command, returnValue: commandHandlerReturnValue }
              });
            });

            debugEmitter && debugEmitter.next({ stage: COMMAND_HANDLERS_OUTPUT_STAGE, value: actions });

            return void 0;
          }
        },
        error: error => {
          // We may get there for instance if there was a preprocessor throwing an exception
          console.error(
            `Machine > Mediator : an error in the event processing chain ! The machine will not process any additional events. Remember that command handlers ought never throw, but should pass errors as events back to the mediator.`,
            error
          );
          debugEmitter && debugEmitter.next({ stage: ERROR_STAGE, value: "" + error });
        },
        complete: () => {
          debugEmitter && debugEmitter.next({ stage: COMPLETE_STAGE, value: "" + error });
        }
      }
    );
    // DOC : we do not trace effectHandlers, there is no generic way to do so
    // and it is better not to do it partially (for example spying on function but leaving the rest intact)
    // DOC CONTRACT : no command handler should throw! but pass errors as messages or events

    // Start with the initial event if any
    initialEvent && this.rawEventSource.next(initialEvent);
  }

  // DOC:  debug emitter must have subject interface i.e.e same as subject factory returns
  componentWillUnmount() {
    this.subscription.unsubscribe();
    this.rawEventSource.complete();
    this.debugEmitter && this.debugEmitter.complete();
    this.finalizeDebugEmitter();
  }

  render() {
    const machineComponent = this;
    return machineComponent.state.render || null;
  }
}

// TODO : harmonize the two adapters naming
export const getStateTransducerRxAdapter = RxApi => {
  const { Subject } = RxApi;

  return {
    subjectFactory: () => {
      return new Subject();
    },
    subscribe: (observable, observer) => observable.subscribe(observer),
  };
};

export const emitonoffAdapter = emitonoff => {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const _ = DUMMY_NAME_SPACE;
  const subscribers = [];
  const subscribeFn = function(f) {
    return (subscribers.push(f), eventEmitter.on(_, f))
  }

  return {
    subjectFactory: () => ({
      next: x => eventEmitter.emit(_, x),
      complete: () => subscribers.forEach(f => eventEmitter.off(_, f)),
      subscribe: subscribeFn
    }),
    // NOTE : Observer is assumed to be always a triple {next, error, complete} even though
    // for a standard event emitter, there is not really an error channel...
    subscribe: (observable, observer) => observable.subscribe(observer.next)
  }
};

// Test framework helpers
function mock(sinonAPI, effectHandlers, mocks, inputSequence) {
  const effects = Object.keys(effectHandlers);
  return effects.reduce((acc, effect) => {
    acc[effect] = sinonAPI.spy(mocks[effect](inputSequence));
    return acc;
  }, {});
}

function forEachOutput(expectedOutput, fn) {
  if (!expectedOutput) return void 0;

  expectedOutput.forEach((output, index) => {
    if (output === NO_OUTPUT) return void 0;
    fn(output, index);
  });
}

function checkOutputs(testHarness, testCase, imageGallery, container, expectedOutput) {
  return forEachOutput(expectedOutput, output => {
    const { then } = testCase;
    const { command, params } = output;
    const matcher = then[command];

    if (matcher === undefined) {
      console.error(
        new Error(
          `test case > ${
            testCase.eventName
            } :: did not find matcher for command ${command}. Please review the 'then' object:`
        ),
        then
      );
      throw `test case > ${testCase.eventName} :: did not find matcher for command ${command}.`;
    } else {
      matcher(testHarness, testCase, imageGallery, container, output);
    }
  });
}

export function testMachineComponent(testAPI, testScenario, machineDef) {
  const { testCases, mocks, when, then, container, mockedMachineFactory } = testScenario;
  const { sinonAPI, test, rtl, debug } = testAPI;

  // TODO : add some contracts here : like same size for input sequence and output sequence
  testCases.forEach(testCase => {
    test(`${testCase.controlStateSequence.join(" -> ")}`, function exec_test(assert) {
      const inputSequence = testCase.inputSequence;
      // NOTE : by construction of the machine, length of input and output sequence are the same!!
      const expectedFsmOutputSequence = testCase.outputSequence;
      const expectedOutputSequence = expectedFsmOutputSequence;
      const mockedEffectHandlers = mock(sinonAPI, machineDef.effectHandlers, mocks, inputSequence);
      const mockedFsm = mockedMachineFactory(machineDef, mockedEffectHandlers);
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
          mocks
        };
        const simulateInput = when[eventName];

        return acc
          .then(() => {
            if (!simulateInput) throw `Cannot find what to do to simulate event ${eventName}!`;
            if (typeof simulateInput !== "function") {
              console.error(
                new Error(`Simulation for event ${eventName} must be defined through a function! Review received ::`),
                simulateInput
              );
              throw `Simulation for event ${eventName} must be defined through a function!`;
            }

            const simulatedInput = tryCatch(simulateInput, logAndRethrow(debug, SIMULATE_INPUT_ERR))(
              testHarness,
              testCase,
              mockedFsm,
              container
            );
            if (simulatedInput instanceof Promise) {
              return simulatedInput.then(() =>
                checkOutputs(testHarness, testCase, mockedFsm, container, expectedOutputSequence[index])
              );
            } else {
              checkOutputs(testHarness, testCase, mockedFsm, container, expectedOutputSequence[index]);
            }
          })
          .then(done)
          .catch(e => {
            console.log(`Error`, e);
            assert.ok(false, e);
            done(e);
          });
      }, Promise.resolve());
    });
  });
}

function assertPropsContract(props) {
  const { fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, options } = props;
  if (!eventHandler) throw new Error(`<Machine/> : eventHandler prop has a falsy value!`);
  const { subjectFactory, subscribe } = eventHandler;
  if (!subjectFactory) throw new Error(`<Machine/> : subjectFactory prop has a falsy value!`);
  if (!subscribe) throw new Error(`<Machine/> : subscribe prop has a falsy value!`);
  if (!fsm) throw new Error(`<Machine/> : fsm prop has a falsy value! Should be specifications for the state machine!`);
}
