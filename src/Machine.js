import React, {Component} from "react";
import {emptyConsole, COMMAND_RENDER} from "./properties";
import {logError, tryCatch} from "./helpers";

const COMMAND_HANDLER_EXEC_ERR = command => `handler for command ${command}`;

function defaultRenderHandler(machineComponent, renderWith, params, next) {
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
    // TODO: I should use React props checking mechanism for this
    // try {assertPropsContract(machineComponent.props);} catch (e) {console.error(e); return}

    const {fsm: _fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, options, renderWith}
      = machineComponent.props;

    const initialEvent = options && options.initialEvent;
    const debug = options && options.debug || null;
    const _console = debug && debug.console || emptyConsole;

    // Wrapping the user-provided API with tryCatch to detect error early
    const wrappedFsm = tryCatch(_fsm, logError(debug, `the state machine!`));

    this.rawEventSource = eventHandler;
    const next = tryCatch(this.rawEventSource.next.bind(this.rawEventSource), logError(debug, `the event handler's 'next' function!`));

    const commandHandlersWithRenderHandler = Object.assign({}, commandHandlers, {
      [COMMAND_RENDER]: function renderHandler(next, params, effectHandlersWithRender) {
        effectHandlersWithRender[COMMAND_RENDER](machineComponent, renderWith, params, next);
      }
    });

    const effectHandlersWithRender =
      effectHandlers && effectHandlers[COMMAND_RENDER]
        ? effectHandlers
        : Object.assign({[COMMAND_RENDER]: defaultRenderHandler}, effectHandlers);

    const preprocessedEventSource = tryCatch(preprocessor || (x => x), logError(debug, `the preprocessor!`))(
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
            actions.filter(action => action !== null)
            .forEach(action => {
              const {command, params} = action;

              const commandHandler = commandHandlersWithRenderHandler[command];
              if (!commandHandler || typeof commandHandler !== "function") {
                throw new Error(
                  `Could not find ${COMMAND_HANDLER_EXEC_ERR(command)}`
                );
              }

              tryCatch(
                commandHandler,
                logError(debug, COMMAND_HANDLER_EXEC_ERR(command))
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
            // `Machine > Mediator: an error in the event processing chain! The machine will not process any additional events. Remember that command handlers ought never throw, but should pass errors as events back to the mediator.`,
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
    // DOC: we no longer throw - log the errors on console, if console is set
    // DOC: preprocessor can be undefined and default to x => x

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

// function assertPropsContract(props) {
//   const {fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, options} = props;
//   if (!eventHandler) throw new Error(`<Machine/> : eventHandler prop has a falsy value!`);
//   if (!fsm) throw new Error(`<Machine/> : fsm prop has a falsy value! Should be specifications for the state machine!`);
// }
