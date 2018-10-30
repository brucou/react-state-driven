import { Component } from "react";
import { create_state_machine, decorateWithEntryActions, NO_OUTPUT } from "state-transducer";
import { COMMAND_RENDER, ERR_COMMAND_HANDLERS } from "./properties";

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

export function commandHandlerFactory(component, trigger, commandHandlers) {
  return actions => {
    if (actions === NO_OUTPUT) {return;}

    actions.forEach(action => {
      if (action === NO_OUTPUT) {return;}

      const { command, params } = action;
      if (command === COMMAND_RENDER) {
        return component.setState({ render: params(trigger) });
      }

      const execFn = commandHandlers[command];
      if (!execFn || typeof execFn !== "function") {
        throw new Error(ERR_COMMAND_HANDLERS(command));
      }

      return execFn(trigger, params);
    });
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
    const { subjectFactory, fsm, commandHandlers, preprocessor } = machineComponent.props;
    assertPropsContract(machineComponent.props);

    // NOTE : the subjectFactory can be any library but must replicate the relevant Rx API
    const Rx = subjectFactory;
    this.rawEventSource = new Rx.Subject();
    const trigger = triggerFnFactory(this.rawEventSource);
    const globalCommandHandler = commandHandlerFactory(machineComponent, trigger, commandHandlers);
    const initialCommand = fsm.start();

    // TODO : pass the subject, not Rx! So I can use replay subject or behaviour subject if I want
    // TODO : then have a behaviour subject for react-state-driven, so I start automatically the machine
    // TODO : for xstate, one can kick the event source, by modifying preprocessor with startWith
    // TODO : remove the start
    // TODO : this.rawE...rce.startsWith(initEvent)
    // TODO : all that after it works
    (preprocessor || identity)(this.rawEventSource)
      .map(fsm.yield)
      .startWith(initialCommand)
      .subscribe(globalCommandHandler)
    ;
  }

  componentWillUnmount() {
    this.rawEventSource.complete();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // called after the render method.
    const machineComponent = this;
    const { componentDidUpdate: cdu } = machineComponent.props;

    if (cdu){
      cdu.call(null, machineComponent, prevProps, prevState, snapshot);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // perform any preparations for an upcoming update
    const machineComponent = this;
    const { componentWillUpdate: cwu } = machineComponent.props;

    if (cwu){
      cwu.call(null, machineComponent, nextProps, nextState);
    }
  }

  render() {
    const machineComponent = this;
    return machineComponent.state.render || null;
  }
}

function assertPropsContract(props){
  const { subjectFactory, fsm, commandHandlers, preprocessor } = props;
  if (!subjectFactory) throw `<Machine/> : subjectFactory prop has a falsy value!`
  if (!fsm) throw `<Machine/> : fsm prop has a falsy value! Should be specifications for the state machine!`
  if (!fsm.yield) throw `<Machine/> : fsm prop must have a yield property!`
}
