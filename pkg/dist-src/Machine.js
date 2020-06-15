function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { emptyConsole, COMMAND_RENDER } from "./properties.js";
import { getEventEmitterAdapter, logError, tryCatch } from "./helpers.js";
import emitonoff from "emitonoff";
export var MOUNTED = "mounted";

var COMMAND_HANDLER_EXEC_ERR = function COMMAND_HANDLER_EXEC_ERR(command) {
  return "handler for command " + command;
};

function defaultRenderHandler(machineComponent, renderWith, params, next) {
  return machineComponent.setState({
    render: /*#__PURE__*/React.createElement(renderWith, Object.assign({}, params, {
      next: next
    }), [])
  }, // DOC : callback for the react default render function in options
  params.postRenderCallback);
}

;
export var Machine = /*#__PURE__*/function (_Component) {
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
  } // NOTE: An interface like <Machine ...><RenderComponent></Machine> is
  // not possible in React/jsx syntax. When passed as part of a `props.children`,
  // the function component would be transformed into a React element,
  // and hence can no longer be used. We do not want the React element, we want
  // the react element factory... It is thereforth necessary to pass the
  // render component as a property (or use a render prop pattern)


  var _proto = Machine.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _ref, _Object$assign, _Object$assign2;

    var machineComponent = this; // TODO: I should use React props checking mechanism for this
    // try {assertPropsContract(machineComponent.props);} catch (e) {console.error(e); return}

    var _machineComponent$pro = machineComponent.props,
        _fsm = _machineComponent$pro.fsm,
        eventHandler = _machineComponent$pro.eventHandler,
        preprocessor = _machineComponent$pro.preprocessor,
        commandHandlers = _machineComponent$pro.commandHandlers,
        effectHandlers = _machineComponent$pro.effectHandlers,
        options = _machineComponent$pro.options,
        renderWith = _machineComponent$pro.renderWith; // initial event is optional. Use it for instance if you want to pass data with the event
    // or if you use the "mounted" string of characters for other purposes
    // or if simply you want to completely decouple the machine from the component

    var initialEvent = options && options.initialEvent || (_ref = {}, _ref[MOUNTED] = void 0, _ref); // `debug` is optional. As of now, includes the console to log debugging info

    var debug = options && options.debug || null;

    var _console = debug && debug.console || emptyConsole; // Wrapping the user-provided API with tryCatch to detect error early


    var wrappedFsm = tryCatch(_fsm, logError(debug, "the state machine!"));
    this.rawEventSource = eventHandler || getEventEmitterAdapter(emitonoff);

    var _next = tryCatch(this.rawEventSource.next.bind(this.rawEventSource), logError(debug, "the event handler's 'next' function!"));

    var commandHandlersWithRenderHandler = Object.assign({}, commandHandlers, (_Object$assign = {}, _Object$assign[COMMAND_RENDER] = function renderHandler(next, params, effectHandlersWithRender) {
      effectHandlersWithRender[COMMAND_RENDER](machineComponent, renderWith, params, next);
    }, _Object$assign));
    var effectHandlersWithRender = effectHandlers && effectHandlers[COMMAND_RENDER] ? effectHandlers : Object.assign((_Object$assign2 = {}, _Object$assign2[COMMAND_RENDER] = defaultRenderHandler, _Object$assign2), effectHandlers || {});
    var preprocessedEventSource = tryCatch(preprocessor || function (x) {
      return x;
    }, logError(debug, "the preprocessor!"))(this.rawEventSource);
    this.subscription = preprocessedEventSource.subscribe({
      next: function next(event) {
        // 1. Run the input on the machine to obtain the actions to perform
        var actions = wrappedFsm(event); // 2. Execute the actions, if any

        if (actions === null) {
          return void 0;
        } else {
          actions.filter(function (action) {
            return action !== null;
          }).forEach(function (action) {
            var command = action.command,
                params = action.params;
            var commandHandler = commandHandlersWithRenderHandler[command];

            if (!commandHandler || typeof commandHandler !== "function") {
              throw new Error("Could not find " + COMMAND_HANDLER_EXEC_ERR(command));
            }

            tryCatch(commandHandler, logError(debug, COMMAND_HANDLER_EXEC_ERR(command)))(_next, params, effectHandlersWithRender); // NOTE : generally command handlers won't return values synchronously
            // It is however possible and we should trace that
          });
          return void 0;
        }
      },
      error: function error(_error) {
        // We may get there for instance if there was a preprocessor throwing an exception
        _console.error( // `Machine > Mediator: an error in the event processing chain! The machine will not process any additional events. Remember that command handlers ought never throw, but should pass errors as events back to the mediator.`,
        _error);
      },
      complete: function complete() {}
    }); // DOC : we do not trace effectHandlers
    // DOC CONTRACT: no command handler should throw! but pass errors as messages or events
    // DOC: error behavior. Errors should be captured by the event emitter and forwarded to the error method
    // It is up to the API user to decide if to complete the subject or not
    // DOC: we no longer throw - log the errors on console, if console is set
    // DOC: preprocessor can be undefined and default to x => x
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
}(Component); // function assertPropsContract(props) {
//   const {fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, options} = props;
//   if (!eventHandler) throw new Error(`<Machine/> : eventHandler prop has a falsy value!`);
//   if (!fsm) throw new Error(`<Machine/> : fsm prop has a falsy value! Should be specifications for the state machine!`);
// }