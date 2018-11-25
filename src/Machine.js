import { Component } from "react";
import { NO_OUTPUT } from "state-transducer";
import { COMMAND_RENDER } from "./properties";

const identity = x => x;

export function triggerFnFactory(rawEventSource) {
  return rawEventName => {
    // DOC : by convention, [rawEventName, rawEventData, ref (optional), ...anything else]
    // DOC : rawEventData is generally the raw event passed by the event handler
    // DOC : `ref` here is :: React.ElementRef and is generally used to pass `ref`s for uncontrolled component
    return function eventHandler(...args) {
      return rawEventSource.next([rawEventName].concat(args));
    };
  };
}

function isHandlerObsOperator(handler) {
  if (!handler || (typeof handler !== "function") || (handler.length !== 1 && handler.length !== 2))
    throw new Error(`isHandlerObsOperator : command handler has unexpected shape! Should a be a function with 1 or 2 arguments!`);

  return handler.length === 1;
}

export function commandHandlerFactory(component, trigger, commandHandlers, eventHandler, effectHandlers) {
  const { create, merge, filter, map, flatMap, shareReplay } = eventHandler;

  return function globalCommandHandler(actions$) {
    const nonEmptyActions$ = actions$.pipe(
      filter(actions => actions !== NO_OUTPUT),
      map(actions => actions.filter(action => action !== NO_OUTPUT)),
      // NOTE : trick to flatten the array of actions into the stream
      // while still keeping order of execution of actions
      flatMap(actions => create(o => {
        actions.forEach(action => o.next({ ...action, trigger }));
        o.complete();
      })),
      // NOTE : I have no idea why a replay here, it should be enough with share() but whatever
      shareReplay(1)
    );

    // Compute the handlers for each command configured
    const commandHandlersWithRenderHandler = Object.assign({}, commandHandlers, {
      [COMMAND_RENDER]: function renderHandler(trigger, params) {
        component.setState({ render: params(trigger) });
      }
    });

    const registeredCommands = Object.keys(commandHandlersWithRenderHandler);
    const actionsHandlersArray = registeredCommands.map(command => {
      const commandHandler = commandHandlersWithRenderHandler[command];
      const commandParams$ = nonEmptyActions$.pipe(
        filter(action => action.command === command)
      );

      if (command === COMMAND_RENDER) {
        return commandParams$.pipe(
          map(({ trigger, params }) => commandHandler(trigger, params))
        );
      }
      else {
        return commandHandler(commandParams$, effectHandlers);
      }
    });

    return merge(...actionsHandlersArray);
  };
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
  }

  componentDidMount() {
    const machineComponent = this;
    assertPropsContract(machineComponent.props);
    const { eventHandler, fsm, commandHandlers, preprocessor, effectHandlers } = machineComponent.props;
    const { subjectFactory, create, merge, filter, map, flatMap, shareReplay } = eventHandler;

    this.rawEventSource = subjectFactory();
    const trigger = triggerFnFactory(this.rawEventSource);
    const globalCommandHandler = commandHandlerFactory(machineComponent, trigger, commandHandlers, eventHandler, effectHandlers);
    const preprocessedEventSource = (preprocessor || identity)(this.rawEventSource);

    const executedCommands$ = globalCommandHandler(preprocessedEventSource.pipe(map(fsm.yield)));
    // TODO : error management
    executedCommands$.subscribe(() => { })
    ;
  }

  componentWillUnmount() {
    this.rawEventSource.complete();
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
