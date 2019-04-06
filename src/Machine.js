import React, { Component } from "react";
import { NO_OUTPUT } from "state-transducer";
import {
  COMMAND_HANDLER_INPUT_STAGE, COMMAND_HANDLER_OUTPUT_STAGE, COMMAND_HANDLERS_OUTPUT_STAGE, COMMAND_RENDER,
  COMPLETE_STAGE, emptyConsole, ERROR_STAGE, FSM_INPUT_STAGE, FSM_OUTPUT_STAGE, noop
} from "./properties";
import { identity, logAndRethrow, tryCatch } from "./helpers";

const EVENT_HANDLER_API_NEXT_ERR = `An error occurred while using the 'next' function defined in event handler component prop!`;
const EVENT_HANDLER_API_SUBJECT_FACTORY_ERR = `An error occurred while using the 'subjectFactory' function defined in event handler component prop!`;
const COMMAND_HANDLER_EXEC_ERR = command => `An error occurred while executing command handler for command ${command}`;
const PREPROCESSOR_EXEC_ERR = `An error occurred while executing the preprocessor configured for your <Machine/> component!`;
const FSM_EXEC_ERR = `An error occurred while executing the state machine configured for your <Machine/> component!`;
const SIMULATE_INPUT_ERR = `An error occurred while simulating inputs when testing a <Machine/> component!`;

const defaultRenderHandler = function defaultRenderHandler(machineComponent, renderWith, params, next) {
  return machineComponent.setState(
    { render: React.createElement(renderWith, Object.assign({}, params, { next }), []) },
    // DOC : callback for the react default render function in options
    params.postRenderCallback
  );
};

// TODO next version: error flows to handle also -> pass to the debug emitter!!
// TODO next version: write tests with MovieSearch for debug emitter??
export class Machine extends Component {
  constructor(props) {
    super(props);
    this.state = { render: null };
    this.rawEventSource = null;
    this.debugEmitter = null;
    this.subscription = null;
    this.finalizeDebugEmitter = null;
  }

  // NOTE: An interface like <Machine ...><RenderComponent></Machine> is not possible in React/jsx syntax
  // When passed as part of a `props.children`, the function component would be transformed into a react element
  // and hence can no longer be used. We do not want the react element, we want the react element factory...
  // It is thereforth necessary to pass the render component as a property (or use a render prop pattern)
  componentDidMount() {
    const machineComponent = this;
    assertPropsContract(machineComponent.props);

    const { fsm: _fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, options, renderWith }
      = machineComponent.props;

    const initialEvent = options && options.initialEvent;
    const debug = options && options.debug || null;
    const traceFactory = debug && debug.traceFactory || {};
    const console = debug && debug.console || emptyConsole;

    // Wrapping the user-provided API with tryCatch to detect error early
    const wrappedEventHandlerAPI = {
      subjectFactory: tryCatch(
        eventHandler.subjectFactory,
        logAndRethrow(debug, EVENT_HANDLER_API_SUBJECT_FACTORY_ERR)
      )
    };
    const wrappedFsm = tryCatch(_fsm, logAndRethrow(debug, FSM_EXEC_ERR));

    const { subjectFactory } = wrappedEventHandlerAPI;
    this.rawEventSource = subjectFactory();
    const next = tryCatch(this.rawEventSource.next.bind(this.rawEventSource), logAndRethrow(debug, EVENT_HANDLER_API_NEXT_ERR));

    // We need internal references for cleaning up purposes
    const { factory, destructor } = traceFactory;
    const debugEmitter = this.debugEmitter = (factory || (x => null))();
    this.finalizeDebugEmitter = destructor || noop;

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

export const getStateTransducerRxAdapter = RxApi => {
  const { Subject } = RxApi;

  return {
    subjectFactory: () => {
      return new Subject();
    }
  };
};

export const getEventEmitterAdapter = emitonoff => {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const subscribers = [];

  return {
    subjectFactory: () => ({
      next: x => eventEmitter.emit(DUMMY_NAME_SPACE, x),
      complete: () => subscribers.forEach(f => eventEmitter.off(DUMMY_NAME_SPACE, f)),
      subscribe: ({ next: f, error: _, complete: __ }) => {
        return (subscribers.push(f), eventEmitter.on(DUMMY_NAME_SPACE, f));
      }
    })
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
  const { subjectFactory } = eventHandler;
  if (!subjectFactory) throw new Error(`<Machine/> : subjectFactory prop has a falsy value!`);
  if (!fsm) throw new Error(`<Machine/> : fsm prop has a falsy value! Should be specifications for the state machine!`);
}
