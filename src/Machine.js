import { Component } from "react";
import { NO_OUTPUT } from "state-transducer";
import {
  COMMAND_HANDLER_INPUT_STAGE, COMMAND_HANDLER_OUTPUT_STAGE, COMMAND_RENDER, ERROR_STAGE, FSM_INPUT_STAGE,
  FSM_OUTPUT_STAGE, GLOBAL_COMMAND_HANDLER_INPUT_STAGE, GLOBAL_COMMAND_HANDLER_OUTPUT_STAGE, IFRAME_CONNECT_TIMEOUT,
  IFRAME_DEBUG_URL, PREPROCESSOR_INPUT_STAGE
} from "./properties";
import Penpal from "penpal";
import { defaultRenderHandler } from "./helpers";

const identity = x => x;

export function triggerFnFactory(rawEventSource, eventHandlerAPI, debugEmitter) {
  const { next } = eventHandlerAPI;

  return rawEventName => {
    // DOC : by convention, [rawEventName, rawEventData, ref (optional), ...anything else]
    // DOC : rawEventData is generally the raw event passed by the event handler
    // DOC : `ref` here is :: React.ElementRef and is generally used to pass `ref`s for uncontrolled component
    return function eventHandler(...args) {
      const rawEventStruct = [rawEventName].concat(args);
      // DOC : possibly non-json compatible data might not cross iframe boundary
      debugEmitter && next(debugEmitter, { stage: PREPROCESSOR_INPUT_STAGE, value: rawEventStruct });

      return next(rawEventSource, rawEventStruct);
    };
  };
}

// DOC: debug emitter must be same type as next accepts
// DOC: you can have a render effect handler if necessary, can be used to simulate willUpdate and didUpdate though
// not as precisely (other actions might be executed after the render, hopefully they do not modify react or DOM state)
export function commandHandlerFactory(component, trigger, eventHandler, commandHandlers, effectHandlers, debugEmitter) {
  const { next, pipe, filter, map } = eventHandler;
  const commandHandlersWithRenderHandler = Object.assign({}, commandHandlers, {
    [COMMAND_RENDER]: function renderHandler(trigger, params, effectHandlersWithRender) {
      const newState = { render: params(trigger) };
      effectHandlersWithRender[COMMAND_RENDER](component, newState);
    }
  });
  const effectHandlersWithRender = effectHandlers && effectHandlers[COMMAND_RENDER]
    ? effectHandlers
    : Object.assign({ [COMMAND_RENDER]: defaultRenderHandler }, effectHandlers);

  return function globalCommandHandler(actions$) {
    const executedActions$ = pipe(actions$, [
        // Debug emission, simulation `tap` with `map` to reduce event handler API footprint
        // We trace also the global handler for the edge case when the array of action is empty
        map(actions => {
          debugEmitter && next(debugEmitter, { stage: GLOBAL_COMMAND_HANDLER_INPUT_STAGE, value: actions });
          return actions;
        }),
        filter(actions => actions !== NO_OUTPUT),
        map(actions => actions.filter(action => action !== NO_OUTPUT)),
        // NOTE : trick to flatten the array of actions into the stream
        // while still keeping order of execution of actions
        // TODO : be careful here that's wrong? I should emit a set of actions before the next one yes. But that is
        // implicit by the synchronicity of next. So impose next synchronous in the doc somewhere.
        map(actions => {
          actions.forEach(action => {
            const { command, params } = action;

            debugEmitter && next(debugEmitter, {
              stage: COMMAND_HANDLER_INPUT_STAGE,
              value: action
            });

            const commandHandler = commandHandlersWithRenderHandler[command];
            if (!commandHandler || typeof(commandHandler) !== "function") {
              throw new Error(`Could not find command handler for command ${command}!`);
            }

            // TODO : I should also catch errors occuring there and pass it to the debugger
            const commandHandlerReturnValue = commandHandler(trigger, params, effectHandlersWithRender);

            // NOTE : generally command handlers won't return values synchronously
            // It is however possible and we should trace that
            debugEmitter && next(debugEmitter, {
              stage: COMMAND_HANDLER_OUTPUT_STAGE,
              value: { command: command, returnValue: commandHandlerReturnValue }
            });

          });

          debugEmitter && next(debugEmitter, { stage: GLOBAL_COMMAND_HANDLER_OUTPUT_STAGE, value: actions });

          return actions;
        })
      ]
    );

    return executedActions$;
  };
}

function flattenStreamOfArrays(streamAPI) {
  return streamAPI.concatMap(arr => streamAPI.create(o => {
    arr.forEach(val => o.next(val));
    o.complete();
  }));
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

  connection.promise.then(_child => {isFrameReady = true, child = _child;});
  debugEmitter
  // TODO : change that to a single obseervable.create, that is all I need
    .pipe(
      map(val => {
        if (isFrameReady && buffer.length !== 0) {
          // Empty the buffer
          const copiedBuffer = buffer.slice(0);
          buffer = [];
          return copiedBuffer;
        }
        else if (isFrameReady && buffer.length === 0) {
          return [val];
        }
        else if (!isFrameReady) {
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
        }
        else if (isChildReadyToReceive && childPendingToSend.length === 0) {
          return [val];
        }
        else if (!isChildReadyToReceive) {
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
      wellReceived => { isChildReadyToReceive = true; },
      error => {
        isChildReadyToReceive = true;
        console.error(`Machine > componentDidMount > debug emitter :`, error);
      },
      () => {isChildReadyToReceive = true;}
    );

  return { debugEmitter, connection };
}

/**
 * Class implementing a reactive system modelled by a state machine (fsm).
 * The system behaviour is determined by properties passed at construction time :
 * - `preprocessor` : translate user events and system events into machine events
 * - `fsm` : uninitialized fsm
 * - `commandHandlers` : maps commands output by the fsm to the function executing those commands
 * - componentWillUpdate : a function for customizing `componentWillUpdate` for a class instance. That function
 * however has a different signature, and incorporates the fsm's settings as parameters
 * - componentDidUpdate : a function for customizing `componentDidUpdate` for a class instance. That function
 * however has a different signature, and incorporates the fsm's settings as parameters
 */
export class Machine extends Component {
  constructor(props) {
    super(props);
    this.state = { render: null };
    this.eventHandler = props.eventHandler;
    this.connection = null;
    this.debugEmitter = null;
    this.subscription = null;
  }

  componentDidMount() {
    const machineComponent = this;
    assertPropsContract(machineComponent.props);

    const { fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, options } = machineComponent.props;
    const { debug } = options ? { debug: options.debug } : { debug: null };
    // TODO DOC : concatMap to add because of debug emitter?? try to avoid it
    // const { subjectFactory, next, error, complete, subscribe, pipe, filter, map } = eventHandler;
    // TODO : replace filter, map and pipe by create that is all I need
    // but think about error and completion channels,
    // TODO remove next error complete subscribe, and use it directly on the subject
    // so I only have subjectFactory, ObservableFactory
    const { subjectFactory, next, error, complete, subscribe, pipe, filter, map } = eventHandler;
    const { debugEmitter, connection } = debug
      ? setDebugEmitter(eventHandler, Penpal)
      : { debugEmitter: null, connection: null };
    // We need internal references for cleaning up purposes
    this.connection = connection;
    this.debugEmitter = debugEmitter;

    this.rawEventSource = subjectFactory();
    const trigger = triggerFnFactory(this.rawEventSource, eventHandler, debugEmitter);
    // DOC : we do not trace effectHandlers, there is no generic way to do so
    // and it is better not to do it partially (for example spying on function but leaving the rest intact)
    // TODO : should try catch!!
    const globalCommandHandler =
      commandHandlerFactory(machineComponent, trigger, eventHandler, commandHandlers, effectHandlers, debugEmitter);
    // TODO : should try catch!!
    const preprocessedEventSource = (preprocessor || identity)(this.rawEventSource);

    const traceMachineInput = map(machineInput => {
      debugEmitter && next(debugEmitter, { stage: FSM_INPUT_STAGE, value: machineInput });

      return machineInput;
    });
    const traceMachineOutput = map(machineOutput => {
      // We trace it to detect null values for instance, which we would otherwise escape
      debugEmitter && next(debugEmitter, { stage: FSM_OUTPUT_STAGE, value: machineOutput });

      return machineOutput;
    });

    // TODO : should try catch!! fsm.yield may error all those errors are final!! but pass it to debug emitter first
    // before throwing!
    const executedCommands$ = globalCommandHandler(
      pipe(preprocessedEventSource, [traceMachineInput, map(fsm), traceMachineOutput])
    );
    // TODO DOC CONTRACT : no command handler should throw! but pass errors as messages or events
    subscribe(executedCommands$, {
        next: x => {},
        error: error => {
          console.error(`Machine > Mediator : an error in the event processing chain ! Remember that command handlers ought never throw, but should pass errors as events back to the mediator.`, error);
          debugEmitter && next(debugEmitter, { stage: ERROR_STAGE, value: "" + error });
        },
        complete: () => {}
      }
    );
  }

  // TODO : check that the implementation of complete for debug emitter does complete all listeners (is that necessary?)
  // DOC:  debug emitter must have subject interface i.e.e same as subject factory returns
  componentWillUnmount() {
    this.eventHandler.complete(this.rawEventSource);
    this.subscription.unsubscribe();
    this.debugEmitter && this.eventHandler.complete(this.debugEmitter);
    this.connection && this.connection.destroy();
  }

  render() {
    const machineComponent = this;
    return machineComponent.state.render || null;
  }
}

export const getStateTransducerRxAdapter = RxApi => {
  const { Subject, filter, map } = RxApi;

  return {
    subjectFactory: () => {
      return new Subject();
    },
    next: (obs, val) => obs.next(val),
    error: (obs, error) => obs.next(error),
    complete: obs => obs.complete(),
    subscribe: (observable, observer) => observable.subscribe(observer),
    pipe: (obs, args) => obs.pipe(...args),
    filter: filter,
    map: map,
  };
};

// TODO: write adapter for event emitter

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
      console.error(new Error(`test case > ${testCase.eventName} :: did not find matcher for command ${command}. Please review the 'then' object:`), then);
      throw `test case > ${testCase.eventName} :: did not find matcher for command ${command}.`;
    }
    else {
      matcher(testHarness, testCase, imageGallery, container, output);
    }
  });
}

export function testMachineComponent(testAPI, testScenario, machineDef) {
  const { testCases, mocks, when, then, container, mockedMachineFactory } = testScenario;
  const { sinonAPI, test, rtl } = testAPI;

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

        return acc
          .then(() => {
            if (!when[eventName]) throw `Cannot find what to do to simulate event ${eventName}!`;
            if (typeof when[eventName] !== "function") {
              console.error(new Error(`Simulation for event ${eventName} must be defined through a function! Review received ::`), when[eventName]);
              throw `Simulation for event ${eventName} must be defined through a function!`;
            }

            const simulateInput = when[eventName](testHarness, testCase, mockedFsm, container);
            if (simulateInput instanceof Promise) {
              return simulateInput
                .then(() => checkOutputs(testHarness, testCase, mockedFsm, container, expectedOutputSequence[index]));
            }
            else {
              checkOutputs(testHarness, testCase, mockedFsm, container, expectedOutputSequence[index]);
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
    });
  });
}

function assertPropsContract(props) {
  const { fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, options } = props;
  if (!eventHandler) throw new Error(`<Machine/> : eventHandler prop has a falsy value!`);
  const { subjectFactory, next, error, complete, subscribe, pipe, filter,map } = eventHandler;
  if (!subjectFactory) throw new Error(`<Machine/> : subjectFactory prop has a falsy value!`);
  if (!next) throw new Error(`<Machine/> : next prop has a falsy value!`);
  if (!subscribe) throw new Error(`<Machine/> : subscribe prop has a falsy value!`);
  if (!pipe) throw new Error(`<Machine/> : pipe prop has a falsy value!`);
  if (!filter) throw new Error(`<Machine/> : filter prop has a falsy value!`);
  if (!map) throw new Error(`<Machine/> : map prop has a falsy value!`);
  if (!fsm) throw new Error(`<Machine/> : fsm prop has a falsy value! Should be specifications for the state machine!`);
}
