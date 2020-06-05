'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var noop = function noop() {};
var emptyConsole = {
  log: noop,
  warn: noop,
  info: noop,
  debug: noop,
  error: noop,
  trace: noop
};
var COMMAND_RENDER = 'render';
var NO_STATE_UPDATE = [];

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

var COMMAND_HANDLER_EXEC_ERR = function COMMAND_HANDLER_EXEC_ERR(command) {
  return "An error occurred while executing command handler for command " + command;
};

var PREPROCESSOR_EXEC_ERR = "An error occurred while executing the preprocessor configured for your <Machine/> component!";
var FSM_EXEC_ERR = "An error occurred while executing the state machine configured for your <Machine/> component!";
var SIMULATE_INPUT_ERR = "An error occurred while simulating inputs when testing a <Machine/> component!";

var defaultRenderHandler = function defaultRenderHandler(machineComponent, renderWith, params, next) {
  return machineComponent.setState({
    render: /*#__PURE__*/React__default.createElement(renderWith, Object.assign({}, params, {
      next: next
    }), [])
  }, // DOC : callback for the react default render function in options
  params.postRenderCallback);
};

var Machine = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Machine, _Component);

  function Machine(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = {
      render: null
    };
    _this.rawEventSource = null;
    _this.subscription = null;
    return _this;
  } // NOTE: An interface like <Machine ...><RenderComponent></Machine> is not possible in React/jsx syntax
  // When passed as part of a `props.children`, the function component would be transformed into a react element
  // and hence can no longer be used. We do not want the react element, we want the react element factory...
  // It is thereforth necessary to pass the render component as a property (or use a render prop pattern)


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

    var _console = debug && debug.console || emptyConsole; // Wrapping the user-provided API with tryCatch to detect error early


    var wrappedFsm = tryCatch(_fsm, logAndRethrow(debug, FSM_EXEC_ERR));
    this.rawEventSource = eventHandler;

    var _next = tryCatch(this.rawEventSource.next.bind(this.rawEventSource), logAndRethrow(debug, EVENT_HANDLER_API_NEXT_ERR));

    var commandHandlersWithRenderHandler = Object.assign({}, commandHandlers, (_Object$assign = {}, _Object$assign[COMMAND_RENDER] = function renderHandler(next, params, effectHandlersWithRender) {
      effectHandlersWithRender[COMMAND_RENDER](machineComponent, renderWith, params, next);
    }, _Object$assign));
    var effectHandlersWithRender = effectHandlers && effectHandlers[COMMAND_RENDER] ? effectHandlers : Object.assign((_Object$assign2 = {}, _Object$assign2[COMMAND_RENDER] = defaultRenderHandler, _Object$assign2), effectHandlers);
    var preprocessedEventSource = tryCatch(preprocessor || identity, logAndRethrow(debug, PREPROCESSOR_EXEC_ERR))(this.rawEventSource);
    this.subscription = preprocessedEventSource.subscribe({
      next: function next(event) {
        // 1. Run the input on the machine to obtain the actions to perform
        var actions = wrappedFsm(event); // 2. Execute the actions, if any

        if (actions === null) {
          return void 0;
        } else {
          var filteredActions = actions.filter(function (action) {
            return action !== null;
          });
          filteredActions.forEach(function (action) {
            var command = action.command,
                params = action.params;
            var commandHandler = commandHandlersWithRenderHandler[command];

            if (!commandHandler || typeof commandHandler !== "function") {
              throw new Error("Machine > commandHandlerFactory > globalCommandHandler : Could not find command handler for command " + command + "!");
            }

            var commandHandlerReturnValue = tryCatch(commandHandler, logAndRethrow(debug, COMMAND_HANDLER_EXEC_ERR(command)))(_next, params, effectHandlersWithRender); // NOTE : generally command handlers won't return values synchronously
            // It is however possible and we should trace that
          });
          return void 0;
        }
      },
      error: function error(_error) {
        // We may get there for instance if there was a preprocessor throwing an exception
        _console.error("Machine > Mediator : an error in the event processing chain ! The machine will not process any additional events. Remember that command handlers ought never throw, but should pass errors as events back to the mediator.", _error);
      },
      complete: function complete() {}
    }); // DOC : we do not trace effectHandlers
    // DOC CONTRACT: no command handler should throw! but pass errors as messages or events
    // DOC: error behavior. Errors should be captured by the event emitter and forwarded to the error method
    // It is up to the API user to decide if to complete the subject or not
    // Start with the initial event if any

    initialEvent && this.rawEventSource.next(initialEvent);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.subscription.unsubscribe();
    this.rawEventSource.complete();
  };

  _proto.render = function render() {
    var machineComponent = this;
    return machineComponent.state.render || null;
  };

  return Machine;
}(React.Component);
var getStateTransducerRxAdapter = function getStateTransducerRxAdapter(RxApi) {
  var Subject = RxApi.Subject;
  return new Subject();
};
var getEventEmitterAdapter = function getEventEmitterAdapter(emitonoff) {
  var eventEmitter = emitonoff();
  var DUMMY_NAME_SPACE = "_";
  var subscribers = [];
  var subject = {
    next: function next(x) {
      try {
        eventEmitter.emit(DUMMY_NAME_SPACE, x);
      } catch (e) {
        subject.error(e);
      }
    },
    error: function error(e) {
      throw e;
    },
    complete: function complete() {
      return subscribers.forEach(function (f) {
        return eventEmitter.off(DUMMY_NAME_SPACE, f);
      });
    },
    subscribe: function subscribe(_ref) {
      var f = _ref.next,
          errFn = _ref.error,
          __ = _ref.complete;
      subscribers.push(f);
      eventEmitter.on(DUMMY_NAME_SPACE, f);
      subject.error = errFn;
      return {
        unsubscribe: subject.complete
      };
    }
  };
  return subject;
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
        }).then(done)["catch"](function (e) {
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
  if (!fsm) throw new Error("<Machine/> : fsm prop has a falsy value! Should be specifications for the state machine!");
}

exports.COMMAND_RENDER = COMMAND_RENDER;
exports.Machine = Machine;
exports.NO_STATE_UPDATE = NO_STATE_UPDATE;
exports.getEventEmitterAdapter = getEventEmitterAdapter;
exports.getStateTransducerRxAdapter = getStateTransducerRxAdapter;
exports.testMachineComponent = testMachineComponent;
//# sourceMappingURL=index.js.map
