import React, { Component } from 'react';
import { NO_OUTPUT } from 'state-transducer';

var noop = function noop() {};
var COMMAND_RENDER = 'render';
var NO_STATE_UPDATE = [];
var FSM_INPUT_STAGE = 'FSM_INPUT_STAGE';
var FSM_OUTPUT_STAGE = 'FSM_OUTPUT_STAGE';
var COMMAND_HANDLERS_OUTPUT_STAGE = 'COMMAND_HANDLERS_OUTPUT_STAGE';
var COMMAND_HANDLER_INPUT_STAGE = 'COMMAND_HANDLER_INPUT_STAGE';
var COMMAND_HANDLER_OUTPUT_STAGE = 'COMMAND_HANDLER_OUTPUT_STAGE';
var ERROR_STAGE = 'ERROR_STAGE';
var COMPLETE_STAGE = 'COMPLETE_STAGE';
var emptyConsole = {
  log: noop,
  warn: noop,
  info: noop,
  debug: noop,
  error: noop,
  trace: noop
};

function identity(x) {
  return x;
}
function tryCatch(fn, errCb) {
  return function tryCatch() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    try {
      return fn.apply(fn, args);
    } catch (e) {
      return errCb(e, args);
    }
  };
}
/**
 *
 * @param {{console, debugEmitter, connection}} debug
 * @param errMsg
 * @returns {logAndRethrow}
 */

var logAndRethrow = function logAndRethrowCurried(debug, errMsg) {
  // TODO : I should also catch errors occuring there and pass it to the debugEmitter
  return function logAndRethrow(e, args) {
    debug && debug.console && debug.console.error("logAndRethrow :> errors", errMsg, e);
    debug && debug.console && debug.console.error("logAndRethrow :> args ", args);
    throw e;
  };
};

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
var EVENT_HANDLER_API_NEXT_ERR = "An error occurred while using the 'next' function defined in event handler component prop!";
var EVENT_HANDLER_API_SUBJECT_FACTORY_ERR = "An error occurred while using the 'subjectFactory' function defined in event handler component prop!";

var COMMAND_HANDLER_EXEC_ERR = function COMMAND_HANDLER_EXEC_ERR(command) {
  return "An error occurred while executing command handler for command " + command;
};

var PREPROCESSOR_EXEC_ERR = "An error occurred while executing the preprocessor configured for your <Machine/> component!";
var FSM_EXEC_ERR = "An error occurred while executing the state machine configured for your <Machine/> component!";
var SIMULATE_INPUT_ERR = "An error occurred while simulating inputs when testing a <Machine/> component!";

var defaultRenderHandler = function defaultRenderHandler(machineComponent, renderWith, params, next) {
  return machineComponent.setState({
    render: React.createElement(renderWith, Object.assign({}, params, {
      next: next
    }), [])
  }, // TODO : DOC it
  params.postRenderCallback);
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


var Machine =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Machine, _Component);

  function Machine(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = {
      render: null
    };
    _this.rawEventSource = null;
    _this.debugEmitter = null;
    _this.subscription = null;
    _this.finalizeDebugEmitter = null;
    return _this;
  } // NOTE: An interface like <Machine ...><RenderComponent></Machine> is not possible in React/jsx syntax
  // When passed as part of a `props.children`, the function component would be transformed into a react element
  // and hence can no longer be used. We do not want the react element, we want the react element factory...
  // It is thereforth necessary to pass the render component as a property (or use a render prop pattern)
  // TODO : error flows to handle also -> pass to the debug emitter!!
  // TODO: go to 1.0 with a debug emitter made but tested with console or sth like that
  // TODO : write tests with MovieSearch and also for debug emitter??
  // TODO : then DOC everything, the API won't change


  var _proto = Machine.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _Object$assign, _Object$assign2;

    var machineComponent = this;
    assertPropsContract(machineComponent.props);
    var _machineComponent$pro = machineComponent.props,
        _fsm = _machineComponent$pro.fsm,
        eventHandler = _machineComponent$pro.eventHandler,
        preprocessor = _machineComponent$pro.preprocessor,
        commandHandlers = _machineComponent$pro.commandHandlers,
        effectHandlers = _machineComponent$pro.effectHandlers,
        options = _machineComponent$pro.options,
        renderWith = _machineComponent$pro.renderWith;
    var initialEvent = options && options.initialEvent;
    var debug = options && options.debug || null;
    var traceFactory = debug && debug.traceFactory || {};
    var console = debug && debug.console || emptyConsole; // Wrapping the user-provided API with tryCatch to detect error early

    var wrappedEventHandlerAPI = {
      subjectFactory: tryCatch(eventHandler.subjectFactory, logAndRethrow(debug, EVENT_HANDLER_API_SUBJECT_FACTORY_ERR))
    };
    var wrappedFsm = tryCatch(_fsm, logAndRethrow(debug, FSM_EXEC_ERR));
    var subjectFactory = wrappedEventHandlerAPI.subjectFactory;
    this.rawEventSource = subjectFactory();

    var _next = tryCatch(this.rawEventSource.next.bind(this.rawEventSource), logAndRethrow(debug, EVENT_HANDLER_API_NEXT_ERR)); // We need internal references for cleaning up purposes


    var factory = traceFactory.factory,
        destructor = traceFactory.destructor;

    var debugEmitter = this.debugEmitter = (factory || function (x) {
      return null;
    })();

    this.finalizeDebugEmitter = destructor || noop;
    var commandHandlersWithRenderHandler = Object.assign({}, commandHandlers, (_Object$assign = {}, _Object$assign[COMMAND_RENDER] = function renderHandler(next, params, effectHandlersWithRender) {
      effectHandlersWithRender[COMMAND_RENDER](machineComponent, renderWith, params, next);
    }, _Object$assign));
    var effectHandlersWithRender = effectHandlers && effectHandlers[COMMAND_RENDER] ? effectHandlers : Object.assign((_Object$assign2 = {}, _Object$assign2[COMMAND_RENDER] = defaultRenderHandler, _Object$assign2), effectHandlers);
    var preprocessedEventSource = tryCatch(preprocessor || identity, logAndRethrow(debug, PREPROCESSOR_EXEC_ERR))(this.rawEventSource);
    this.subscription = preprocessedEventSource.subscribe({
      next: function next(event) {
        // 1. Run the input on the machine to obtain the actions to perform
        debugEmitter && debugEmitter.next({
          stage: FSM_INPUT_STAGE,
          value: event
        });
        var actions = wrappedFsm(event);
        debugEmitter && debugEmitter.next({
          stage: FSM_OUTPUT_STAGE,
          value: actions
        }); // 2. Execute the actions, if any

        if (actions === NO_OUTPUT) {
          return void 0;
        } else {
          var filteredActions = actions.filter(function (action) {
            return action !== NO_OUTPUT;
          });
          filteredActions.forEach(function (action) {
            var command = action.command,
                params = action.params;
            debugEmitter && debugEmitter.next({
              stage: COMMAND_HANDLER_INPUT_STAGE,
              value: action
            });
            var commandHandler = commandHandlersWithRenderHandler[command];

            if (!commandHandler || typeof commandHandler !== "function") {
              throw new Error("Machine > commandHandlerFactory > globalCommandHandler : Could not find command handler for command " + command + "!");
            }

            var commandHandlerReturnValue = tryCatch(commandHandler, logAndRethrow(debug, COMMAND_HANDLER_EXEC_ERR(command)))(_next, params, effectHandlersWithRender); // NOTE : generally command handlers won't return values synchronously
            // It is however possible and we should trace that

            debugEmitter && debugEmitter.next({
              stage: COMMAND_HANDLER_OUTPUT_STAGE,
              value: {
                command: command,
                returnValue: commandHandlerReturnValue
              }
            });
          });
          debugEmitter && debugEmitter.next({
            stage: COMMAND_HANDLERS_OUTPUT_STAGE,
            value: actions
          });
          return void 0;
        }
      },
      error: function (_error) {
        function error(_x) {
          return _error.apply(this, arguments);
        }

        error.toString = function () {
          return _error.toString();
        };

        return error;
      }(function (error) {
        // We may get there for instance if there was a preprocessor throwing an exception
        console.error("Machine > Mediator : an error in the event processing chain ! The machine will not process any additional events. Remember that command handlers ought never throw, but should pass errors as events back to the mediator.", error);
        debugEmitter && debugEmitter.next({
          stage: ERROR_STAGE,
          value: "" + error
        });
      }),
      complete: function complete() {
        debugEmitter && debugEmitter.next({
          stage: COMPLETE_STAGE,
          value: "" + error
        });
      }
    }); // DOC : we do not trace effectHandlers, there is no generic way to do so
    // and it is better not to do it partially (for example spying on function but leaving the rest intact)
    // DOC CONTRACT : no command handler should throw! but pass errors as messages or events
    // Start with the initial event if any

    initialEvent && this.rawEventSource.next(initialEvent);
  } // DOC:  debug emitter must have subject interface i.e.e same as subject factory returns
  ;

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.subscription.unsubscribe();
    this.rawEventSource.complete();
    this.debugEmitter && this.debugEmitter.complete();
    this.finalizeDebugEmitter();
  };

  _proto.render = function render() {
    var machineComponent = this;
    return machineComponent.state.render || null;
  };

  return Machine;
}(Component);
var getStateTransducerRxAdapter = function getStateTransducerRxAdapter(RxApi) {
  var Subject = RxApi.Subject;
  return {
    subjectFactory: function subjectFactory() {
      return new Subject();
    }
  };
};
var getEventEmitterAdapter = function getEventEmitterAdapter(emitonoff) {
  var eventEmitter = emitonoff();
  var DUMMY_NAME_SPACE = "_";
  var subscribers = [];
  return {
    subjectFactory: function subjectFactory() {
      return {
        next: function next(x) {
          return eventEmitter.emit(DUMMY_NAME_SPACE, x);
        },
        complete: function complete() {
          return subscribers.forEach(function (f) {
            return eventEmitter.off(DUMMY_NAME_SPACE, f);
          });
        },
        subscribe: function subscribe(_ref) {
          var f = _ref.next,
              _ = _ref.error,
              __ = _ref.complete;
          return subscribers.push(f), eventEmitter.on(DUMMY_NAME_SPACE, f);
        }
      };
    }
  };
}; // Test framework helpers

function mock(sinonAPI, effectHandlers, mocks, inputSequence) {
  var effects = Object.keys(effectHandlers);
  return effects.reduce(function (acc, effect) {
    acc[effect] = sinonAPI.spy(mocks[effect](inputSequence));
    return acc;
  }, {});
}

function forEachOutput(expectedOutput, fn) {
  if (!expectedOutput) return void 0;
  expectedOutput.forEach(function (output, index) {
    if (output === NO_OUTPUT) return void 0;
    fn(output, index);
  });
}

function checkOutputs(testHarness, testCase, imageGallery, container, expectedOutput) {
  return forEachOutput(expectedOutput, function (output) {
    var then = testCase.then;
    var command = output.command,
        params = output.params;
    var matcher = then[command];

    if (matcher === undefined) {
      console.error(new Error("test case > " + testCase.eventName + " :: did not find matcher for command " + command + ". Please review the 'then' object:"), then);
      throw "test case > " + testCase.eventName + " :: did not find matcher for command " + command + ".";
    } else {
      matcher(testHarness, testCase, imageGallery, container, output);
    }
  });
}

function testMachineComponent(testAPI, testScenario, machineDef) {
  var testCases = testScenario.testCases,
      mocks = testScenario.mocks,
      when = testScenario.when,
      then = testScenario.then,
      container = testScenario.container,
      mockedMachineFactory = testScenario.mockedMachineFactory;
  var sinonAPI = testAPI.sinonAPI,
      test = testAPI.test,
      rtl = testAPI.rtl,
      debug = testAPI.debug; // TODO : add some contracts here : like same size for input sequence and output sequence

  testCases.forEach(function (testCase) {
    test("" + testCase.controlStateSequence.join(" -> "), function exec_test(assert) {
      var inputSequence = testCase.inputSequence; // NOTE : by construction of the machine, length of input and output sequence are the same!!

      var expectedFsmOutputSequence = testCase.outputSequence;
      var expectedOutputSequence = expectedFsmOutputSequence;
      var mockedEffectHandlers = mock(sinonAPI, machineDef.effectHandlers, mocks, inputSequence);
      var mockedFsm = mockedMachineFactory(machineDef, mockedEffectHandlers);
      var done = assert.async(inputSequence.length);
      inputSequence.reduce(function (acc, input, index) {
        var eventName = Object.keys(input)[0];
        var eventData = input[eventName];
        var testHarness = {
          assert: assert,
          rtl: rtl
        };
        var testCase = {
          eventName: eventName,
          eventData: eventData,
          expectedOutput: expectedOutputSequence[index],
          inputSequence: inputSequence,
          expectedOutputSequence: expectedOutputSequence,
          mockedEffectHandlers: mockedEffectHandlers,
          when: when,
          then: then,
          mocks: mocks
        };
        var simulateInput = when[eventName];
        return acc.then(function () {
          if (!simulateInput) throw "Cannot find what to do to simulate event " + eventName + "!";

          if (typeof simulateInput !== "function") {
            console.error(new Error("Simulation for event " + eventName + " must be defined through a function! Review received ::"), simulateInput);
            throw "Simulation for event " + eventName + " must be defined through a function!";
          }

          var simulatedInput = tryCatch(simulateInput, logAndRethrow(debug, SIMULATE_INPUT_ERR))(testHarness, testCase, mockedFsm, container);

          if (simulatedInput instanceof Promise) {
            return simulatedInput.then(function () {
              return checkOutputs(testHarness, testCase, mockedFsm, container, expectedOutputSequence[index]);
            });
          } else {
            checkOutputs(testHarness, testCase, mockedFsm, container, expectedOutputSequence[index]);
          }
        }).then(done).catch(function (e) {
          console.log("Error", e);
          assert.ok(false, e);
          done(e);
        });
      }, Promise.resolve());
    });
  });
}

function assertPropsContract(props) {
  var fsm = props.fsm,
      eventHandler = props.eventHandler,
      preprocessor = props.preprocessor,
      commandHandlers = props.commandHandlers,
      effectHandlers = props.effectHandlers,
      options = props.options;
  if (!eventHandler) throw new Error("<Machine/> : eventHandler prop has a falsy value!");
  var subjectFactory = eventHandler.subjectFactory;
  if (!subjectFactory) throw new Error("<Machine/> : subjectFactory prop has a falsy value!");
  if (!fsm) throw new Error("<Machine/> : fsm prop has a falsy value! Should be specifications for the state machine!");
}

export { COMMAND_RENDER, Machine, NO_STATE_UPDATE, getEventEmitterAdapter, getStateTransducerRxAdapter, testMachineComponent };
