import React, {Component} from "react";
import {emptyConsole, noop, COMMAND_RENDER} from "./properties";
import {identity, logAndRethrow, tryCatch} from "./helpers";

const EVENT_HANDLER_API_NEXT_ERR = `An error occurred while using the 'next' function defined in event handler component prop!`;
const COMMAND_HANDLER_EXEC_ERR = command => `An error occurred while executing command handler for command ${command}`;
const PREPROCESSOR_EXEC_ERR = `An error occurred while executing the preprocessor configured for your <Machine/> component!`;
const FSM_EXEC_ERR = `An error occurred while executing the state machine configured for your <Machine/> component!`;
const SIMULATE_INPUT_ERR = `An error occurred while simulating inputs when testing a <Machine/> component!`;

const defaultRenderHandler = function defaultRenderHandler(machineComponent, renderWith, params, next) {
  return machineComponent.setState(
    {render: React.createElement(renderWith, Object.assign({}, params, {next}), [])},
    // DOC : callback for the react default render function in options
    params.postRenderCallback
  );
};

export class Machine extends Component {
  constructor(props) {
    super(props);
    this.state = {render: null};
    this.rawEventSource = null;
    this.subscription = null;
  }

  // NOTE: An interface like <Machine ...><RenderComponent></Machine> is not possible in React/jsx syntax
  // When passed as part of a `props.children`, the function component would be transformed into a react element
  // and hence can no longer be used. We do not want the react element, we want the react element factory...
  // It is thereforth necessary to pass the render component as a property (or use a render prop pattern)
  componentDidMount() {
    const machineComponent = this;
    assertPropsContract(machineComponent.props);

    const {fsm: _fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, options, renderWith}
      = machineComponent.props;

    const initialEvent = options && options.initialEvent;
    const debug = options && options.debug || null;
    const _console = debug && debug.console || emptyConsole;

    // Wrapping the user-provided API with tryCatch to detect error early
    const wrappedFsm = tryCatch(_fsm, logAndRethrow(debug, FSM_EXEC_ERR));

    this.rawEventSource = eventHandler;
    const next = tryCatch(this.rawEventSource.next.bind(this.rawEventSource), logAndRethrow(debug, EVENT_HANDLER_API_NEXT_ERR));

    const commandHandlersWithRenderHandler = Object.assign({}, commandHandlers, {
      [COMMAND_RENDER]: function renderHandler(next, params, effectHandlersWithRender) {
        effectHandlersWithRender[COMMAND_RENDER](machineComponent, renderWith, params, next);
      }
    });

    const effectHandlersWithRender =
      effectHandlers && effectHandlers[COMMAND_RENDER]
        ? effectHandlers
        : Object.assign({[COMMAND_RENDER]: defaultRenderHandler}, effectHandlers);

    const preprocessedEventSource = tryCatch(preprocessor || identity, logAndRethrow(debug, PREPROCESSOR_EXEC_ERR))(
      this.rawEventSource
    );

    this.subscription = preprocessedEventSource.subscribe({
        next: event => {
          // 1. Run the input on the machine to obtain the actions to perform
          const actions = wrappedFsm(event);

          // 2. Execute the actions, if any
          if (actions === null) {
            return void 0;
          }
          else {
            const filteredActions = actions.filter(action => action !== null);
            filteredActions.forEach(action => {
              const {command, params} = action;

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
            });

            return void 0;
          }
        },
        error: error => {
          // We may get there for instance if there was a preprocessor throwing an exception
          _console.error(
            `Machine > Mediator : an error in the event processing chain ! The machine will not process any additional events. Remember that command handlers ought never throw, but should pass errors as events back to the mediator.`,
            error
          );
        },
        complete: () => {
        }
      }
    );
    // DOC : we do not trace effectHandlers
    // DOC CONTRACT: no command handler should throw! but pass errors as messages or events
    // DOC: error behavior. Errors should be captured by the event emitter and forwarded to the error method
    // It is up to the API user to decide if to complete the subject or not

    // Start with the initial event if any
    initialEvent && this.rawEventSource.next(initialEvent);
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
    this.rawEventSource.complete();
  }

  render() {
    const machineComponent = this;
    return machineComponent.state.render || null;
  }
}

export const getStateTransducerRxAdapter = RxApi => {
  const {Subject} = RxApi;

  return new Subject();
};

export const getEventEmitterAdapter = emitonoff => {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const subscribers = [];

  const subject = {
    next: x => {
      try {
        eventEmitter.emit(DUMMY_NAME_SPACE, x)
      } catch (e) {
        subject.error(e);
      }
    },
    error: e => {
      throw e
    },
    complete: () => subscribers.forEach(f => eventEmitter.off(DUMMY_NAME_SPACE, f)),
    subscribe: ({next: f, error: errFn, complete: __}) => {
      subscribers.push(f);
      eventEmitter.on(DUMMY_NAME_SPACE, f);
      subject.error = errFn;
      return {unsubscribe: subject.complete}
    }
  };
  return subject;
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
    const {then} = testCase;
    const {command, params} = output;
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
  const {testCases, mocks, when, then, container, mockedMachineFactory} = testScenario;
  const {sinonAPI, test, rtl, debug} = testAPI;

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
        const testHarness = {assert, rtl};
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
  const {fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, options} = props;
  if (!eventHandler) throw new Error(`<Machine/> : eventHandler prop has a falsy value!`);
  if (!fsm) throw new Error(`<Machine/> : fsm prop has a falsy value! Should be specifications for the state machine!`);
}
