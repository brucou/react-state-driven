import { Component } from "react";
import { NO_OUTPUT } from "state-transducer";
import {
  COMMAND_HANDLER_INPUT_STAGE, COMMAND_HANDLER_OUTPUT_STAGE, COMMAND_RENDER, ERROR_STAGE, FSM_INPUT_STAGE,
  GLOBAL_COMMAND_HANDLER_INPUT_STAGE, IFRAME_CONNECT_TIMEOUT, IFRAME_DEBUG_URL, PREPROCESSOR_INPUT_STAGE
} from "./properties";
import Penpal from "penpal";

const identity = x => x;

export function triggerFnFactory(rawEventSource, debugEmitter) {
  return rawEventName => {
    // DOC : by convention, [rawEventName, rawEventData, ref (optional), ...anything else]
    // DOC : rawEventData is generally the raw event passed by the event handler
    // DOC : `ref` here is :: React.ElementRef and is generally used to pass `ref`s for uncontrolled component
    return function eventHandler(...args) {
      const rawEventStruct = [rawEventName].concat(args);
      // DOC : possibly non-json compatible data might not cross iframe boundary
      debugEmitter && debugEmitter.next({ stage: PREPROCESSOR_INPUT_STAGE, value: rawEventStruct });

      return rawEventSource.next(rawEventStruct);
    };
  };
}

export function commandHandlerFactory(component, trigger, eventHandler, commandHandlers, effectHandlers, debugEmitter) {
  const { create, merge, filter, map, flatMap, concatMap, shareReplay } = eventHandler;

  return function globalCommandHandler(actions$) {
    const nonEmptyActions$ = actions$.pipe(
      // Debug emission, simulation `tap` with `map` to reduce event handler API footprint
      map(actions => {
        debugEmitter && debugEmitter.next({ stage: GLOBAL_COMMAND_HANDLER_INPUT_STAGE, value: actions });
        return actions;
      }),
      filter(actions => actions !== NO_OUTPUT),
      map(actions => actions.filter(action => action !== NO_OUTPUT)),
      // NOTE : trick to flatten the array of actions into the stream
      // while still keeping order of execution of actions
      concatMap(actions => create(o => {
        actions.forEach(action => o.next({ ...action, trigger }));
        o.complete();
      })),
      // NOTE : I have no idea why a replay here, it should be enough with share() but whatever
      shareReplay(1)
    );

    // Compute the handlers for each command configured
    const commandHandlersWithRenderHandler = Object.assign({}, commandHandlers, {
      [COMMAND_RENDER]: function renderHandler(trigger, params) {
        const newState = { render: params(trigger) };
        debugEmitter && debugEmitter.next({
          stage: COMMAND_HANDLER_INPUT_STAGE,
          value: { command: COMMAND_RENDER, params: newState.render }
        });

        component.setState(newState);
      }
    });

    const registeredCommands = Object.keys(commandHandlersWithRenderHandler);
    const actionsHandlersArray = registeredCommands.map(command => {
      const commandHandler = commandHandlersWithRenderHandler[command];
      const commandParams$ = nonEmptyActions$.pipe(
        filter(action => action.command === command),
        map(action => {
          debugEmitter && debugEmitter.next({
            stage: COMMAND_HANDLER_INPUT_STAGE,
            value: action
          });

          return action;
        })
      );

      if (command === COMMAND_RENDER) {
        return commandParams$.pipe(
          map(({ trigger, params }) => commandHandler(trigger, params))
        );
      }
      else {
        return commandHandler(commandParams$, effectHandlers).pipe(
          // NOTE : generally command handlers won't return values synchronously
          // It is however possible and we should trace that
          map(commandHandlerReturnValue => {
            debugEmitter && debugEmitter.next({
              stage: COMMAND_HANDLER_OUTPUT_STAGE,
              value: { command: command, returnValue: commandHandlerReturnValue }
            });

            return commandHandlerReturnValue;
          })
        );
      }
    });

    return merge(...actionsHandlersArray);
  };
}

function flattenStreamOfArrays(streamAPI) {
  return streamAPI.concatMap(arr => streamAPI.create(o => {
    arr.forEach(val => o.next(val));
    o.complete();
  }));
}

function setDebugEmitter(eventHandler, Penpal) {
  const { subjectFactory, create, merge, filter, map, flatMap, concatMap, shareReplay } = eventHandler;
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
  // TODO : DOC concatMap, and concatMap and flatMap must admit promises as return value

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
    this.connection = null;
    this.debugEmitter = null;
  }

  componentDidMount() {
    const machineComponent = this;
    assertPropsContract(machineComponent.props);
    const { eventHandler, fsm, commandHandlers, preprocessor, effectHandlers, options } = machineComponent.props;
    const { debug, initialEvent } = options
      ? { debug: options.debug, initialEvent: options.initialEvent }
      : { debug: null, initialEvent: null };
    // TODO DOC : startWith and concatMap to add
    const { subjectFactory, create, merge, filter, map, flatMap, concatMap, startWith, shareReplay } = eventHandler;
    const { debugEmitter, connection } = debug
      ? setDebugEmitter(eventHandler, Penpal)
      : { debugEmitter: null, connection: null };
    // We need internal references for cleaning up purposes
    this.connection = connection;
    this.debugEmitter = debugEmitter;

    this.rawEventSource = subjectFactory();
    const trigger = triggerFnFactory(this.rawEventSource, debugEmitter);
    // DOC : we do not trace effectHandlers, there is no generic way to do so
    // and it is better not to do it partially (for example spying on function but leaving the rest intact)
    const globalCommandHandler =
      commandHandlerFactory(machineComponent, trigger, eventHandler, commandHandlers, effectHandlers, debugEmitter);
    const preprocessedEventSource = (preprocessor || identity)(this.rawEventSource);

    const traceMachineInput = map(machineInput => {
      debugEmitter && debugEmitter.next({
        stage: FSM_INPUT_STAGE,
        value: machineInput
      });

      return machineInput;
    });

    const executedCommands$ = globalCommandHandler(
      initialEvent
        ? preprocessedEventSource.pipe(startWith(initialEvent), traceMachineInput, map(fsm.yield))
        : preprocessedEventSource.pipe(traceMachineInput, map(fsm.yield))
    );
    // TODO DOC CONTRACT : no command handler should throw! but pass errors as messages or events
    executedCommands$.subscribe(
      () => { },
      error => {
        console.error(`Machine > Mediator : an error in the event processing chain ! Remember that command handlers ought never throw, but should pass errors as events back to the mediator.`, error);
        debugEmitter && debugEmitter.next({ stage: ERROR_STAGE, value: "" + error });
      },
      () => {}
    );
  }

  componentWillUnmount() {
    this.rawEventSource.complete();
    this.debugEmitter && this.debugEmitter.complete();
    this.connection && this.connection.destroy();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // called after the render method.
    const machineComponent = this;
    const { componentDidUpdate: cdu } = machineComponent.props;

    if (cdu) {
      cdu.call(null, machineComponent, prevProps, prevState, snapshot);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // perform any preparations for an upcoming update
    const machineComponent = this;
    const { componentWillUpdate: cwu } = machineComponent.props;

    if (cwu) {
      cwu.call(null, machineComponent, nextProps, nextState);
    }
  }

  render() {
    const machineComponent = this;
    return machineComponent.state.render || null;
  }
}

export const getStateTransducerRxAdapter = RxApi => {
  const { Subject, merge, Observable, filter, flatMap, concatMap, map, startWith, shareReplay } = RxApi;

  return {
    // NOTE : this is start the machine, by sending the INIT_EVENT immediately prior to any other
    subjectFactory: () => new Subject(),
    // NOTE : must be bound, because, reasons
    merge: merge,
    create: fn => Observable.create(fn),
    filter: filter,
    map: map,
    flatMap: flatMap,
    concatMap: concatMap,
    startWith: startWith,
    shareReplay: shareReplay
  };
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
  const { eventHandler, fsm, commandHandlers, preprocessor } = props;
  if (!eventHandler) throw new Error(`<Machine/> : eventHandler prop has a falsy value!`);
  const { subjectFactory, create, merge } = eventHandler;
  if (!subjectFactory) throw new Error(`<Machine/> : subjectFactory prop has a falsy value!`);
  if (!create) throw new Error(`<Machine/> : create prop has a falsy value!`);
  if (!merge) throw new Error(`<Machine/> : merge prop has a falsy value!`);
  if (!fsm) throw new Error(`<Machine/> : fsm prop has a falsy value! Should be specifications for the state machine!`);
  if (!fsm.yield) throw new Error(`<Machine/> : fsm prop must have a yield property!`);
}
