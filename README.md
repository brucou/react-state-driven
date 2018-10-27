- [Motivation](#motivation)
- [Modelling user interfaces with state machines](#modelling-user-interfaces-with-state-machines)
- [Installation](#installation)
- [API design goals](#api-design-goals)
- [API](#api)
    + [Description](#description)
    + [Example](#example)
    + [Types](#types)
    + [Semantics](#semantics)
- [Tips and gotchas](#tips-and-gotchas)
- [Further examples](#further-examples)
  * [Controlled form](#controlled-form)
  * [Uncontrolled form with ref](#uncontrolled-form-with-ref)
- [Testing](#testing)

# Motivation
User interfaces are reactive systems which can be modelized accurately by state machines. There 
is a number of state machine libraries in the field with varying design objectives. We have proposed
 an extended state machine library with a minimal API, architected around a single causal, 
 effect-less function. This particular design requires integration with the interfaced 
 systems, in order to produce the necessary effects (user events, system events, user actions). We
  present here an integration of our [proposed machine library](https://github.com/brucou/state-transducer) with `React`. 

This document is structured as follows :

- we quickly present the rationale behind modelling user interfaces with state machines and the 
resulting architecture
- we continue with our API design goals
- we finally explain and document the actual API together with a not-so-trivial example of use, 
taken from other similar libraries

# Modelling user interfaces with state machines
We are going all along to refer to a image search application example to illustrate our 
argumentation. Cf. [Example section](#example) for more details.

In a traditional architecture, a simple scenario would be expressed as follows :

![image search basic scenario](assets/Image%20search%20scenario.png)

What we can derive from that is that the application is interfacing with other systems : the user
 interface and what we call external systems (local storage, databases, etc.). The application 
 responsibility is to translate user actions on the user interface into commands on the external systems, execute those commands and deal with their result.

In our proposed architecture, the same scenario would become :

![image search basic scenario](assets/Image%20search%20scenario%20with%20fsm.png)

In that architecture, the application is refactored into a mediator, a preprocessor, a state 
machine, and a command handler. The application is thus split into smaller parts which address 
specific concerns :
- the preprocessor translates user interface events into inputs for the state machine
- the state machine computes the commands to execute as a result of its present and past inputs, 
or, what is equivalent, its present input and current state 
- the command handler interprets and executes incoming commands
- the mediator coordinates the user interface, the preprocessor, the state machine and the command 
handler

Apart from the separation of concerns we have achieved, we also have successfully reduced 
the incidental complexity of our implementation :
- the mediator algorithm is the same independently of the pieces it coordinates. This means it 
can be written and tested once, then reused at will. This is our `<Machine />` component. This is
 glue code that you do not have to write anymore.
- command handlers are pretty generic pieces of code. An example could be code to fetch a 
resource. That code is written and tested once, and then reused for any resource. Additionally, 
only the command handler can perform effects on the external systems, which helps tracing and 
debugging. 
- the state machine is a function which **performs no effects**, and whose output exclusively depends 
on current state, and present input[^2]. We will use the term *causal* functions for such 
functions, in  reference to [causal systems](https://en.wikipedia.org/wiki/Causal_system), which 
exhibit the same property[^1]. The causality property means state machines are a breeze
 to reason about and test (well, not as much as pure functions, but infinitely better than 
 effectful functions).
- only the preprocessor and mediator can perform effects on the user interface, which helps 
tracing and debugging. 

We also have achieved greater modularity: our parts are coupled only through their interface. For
 instance, we use in our implementation `Rxjs` for preprocessing events, and [`state-transducer`](https://github.com/brucou/state-transducer) as state machine library. We could easily switch to
   [`most`](https://github.com/cujojs/most) and [`xstate`](https://github.com/davidkpiano/xstate)
    if the need be, by simply building interface adapters.

There are more benefits but this is not the place to go about them. Cf:
- [User interfaces as reactive systems](https://brucou.github.io/posts/user-interfaces-as-reactive-systems/)
- [Pure UI](https://rauchg.com/2015/pure-ui)
- [Pure UI control](https://medium.com/@asolove/pure-ui-control-ac8d1be97a8d)

{^1]: Another term used elsewhere is *deterministic* functions, but we 
      found that term could be confusing.          
[^2]: In relation with state machines, it is the same to say that 
      an output depends exclusively on past and present inputs and that an output exclusively depends 
      on current state, and present input[^2].

# Installation
> `react`  is a peer dependency.

```sh
npm install react-state-driven
```

# API design goals
We want to have an integration which is generic enough to accomodate a large set of use cases, 
and specific enough to be able to take advantage as much as possible of the `React` ecosystem 
and API. In particular :

- it should be seamless to use both controlled and uncontrolled components
- it should be possible to use without risk of interference standard React features like `Context`
- it should use the absolute minimum React features internally, in order to favor for instance a 
painless port to React copycats (Preact, etc.)
- non-React functionalities should be coupled only through interfaces, allowing to use any 
suitable implementation

As a result of these design goals :
- we do not use React context, portal, fragments, `jsx`, and use the minimum React lifecycle hooks
- the component user can of course use the whole extent of the API at disposal, those restrictions 
only concern our implementation of the `<Machine /` component.
- we defined interfaces for extended state updates (reducer interface), event processing 
(observer and observable interfaces).
- any state machine implementation can be substituted to our library provided that :
  - it implements a `.start` and `.yield` methods, with `start` being sugar for `.yield({init: some
   data})`.
  - it produces no effects
  - it returns an array of commands (implementation relying on callback or event hooks cannot be 
  integrated)

# API
##` <Machine fsm, commandHandlers, preprocessor, subjectFactory, componentDidUpdate, componentWillUpdate />`

### Description
We expose a `<Machine />` React component which will hold the state machine and implement its 
behaviour using React's API. The `Machine` component behaviour is specified by its props. Those 
props reflect : the underlying machine, pre-processing of interfaced 
system's raw events, functions executing machine commands and performing effects on the 
interfaced systems. They also include `componentDidUpdate` and `componentWillUpdate` props
 to integrate with the relevant React API. 
Our `Machine` component expects some props but does not expect children components. 

### Example
To showcase 
usage of our react component with our machine library, we will implement an [image search 
application](https://css-tricks.com/robust-react-user-interfaces-with-finite-state-machines/#article-header-id-5). 
That application basically takes an input from the user, looks up images related
 to that search input, and displays it. The user can then click on a particular image to see it 
 in more details. 
 
For illustration, the user interface starts like this :

![image search interface](https://i.imgur.com/mDQQTX8.png?1) 

 The corresponding machine is here :

![machine visualization](https://i.imgur.com/z4hn4Cv.png?1)

So we have the machine specifying the behaviour of our image search. Let's see how to integrate 
that React using our `Machine` component.

```javascript
export class GalleryApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { query, photo, items, trigger, gallery: galleryState } = this.props;

    return div(".ui-app", { 'data-state': galleryState }, [
      h(Form, { galleryState, onSubmit: trigger('onSubmit'), onClick: trigger('onCancelClick') }, []),
      h(Gallery, { galleryState, items, onClick: trigger('onGalleryClick') }, []),
      h(Photo, { galleryState, photo, onClick: trigger('onPhotoClick') }, [])
    ])
  }
}

const renderGalleryApp = machineState => (extendedState, eventData, fsmSettings) => {
  const { query, items, photo } = extendedState;
 
  return renderAction(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: machineState }, []))
}

export const machines = {
  imageGallery: {
    initialExtendedState: { query: '', items: [], photo: undefined },
    states: { start: '', loading: '', gallery: '', error: '', photo: '' },
    events: ['SEARCH', 'SEARCH_SUCCESS', 'SEARCH_FAILURE', 'CANCEL_SEARCH', 'SELECT_PHOTO', 'EXIT_PHOTO'],
    transitions : ... transitions not included here, cf. visualization) ...,
    preprocessor: rawEventSource => rawEventSource
      .map(ev => {
        const { eventName, eventData: e, ref } = destructureEvent(ev);

        // Form raw events
        if (eventName === 'onSubmit') {
          e.persist();
          e.preventDefault();
          return { SEARCH: ref.current.value }
        }
        else if (eventName === 'onCancelClick') {
          return { CANCEL_SEARCH: void 0 }
        }
        // Gallery
        else if (eventName === 'onGalleryClick') {
          const item = e;
          return { SELECT_PHOTO: item }
        }
        // Photo detail
        else if (eventName === 'onPhotoClick') {
          return { EXIT_PHOTO: void 0 }
        }
        // System events
        else if (eventName === 'SEARCH_SUCCESS') {
          const items = e;
          return { SEARCH_SUCCESS: items }
        }
        else if (eventName === 'SEARCH_FAILURE') {
          return { SEARCH_FAILURE: void 0 }
        }

        return NO_INTENT
      })
      .filter(x => x !== NO_INTENT),
    entryActions: {
      loading: (extendedState, eventData, fsmSettings) => {
        const { items, photo } = extendedState;
        const query = eventData;
        const searchCommand = {
          command: COMMAND_SEARCH,
          params: query
        };
        const renderGalleryAction = renderAction(trigger =>
          h(GalleryApp, { query, items, trigger, photo, gallery: 'loading' }, [])
        );

        return {
          outputs: [searchCommand, renderGalleryAction.outputs],
          updates: NO_STATE_UPDATE
        }
      },
      photo: renderGalleryApp('photo'),
      gallery: renderGalleryApp('gallery'),
      error: renderGalleryApp('error'),
      start: renderGalleryApp('start'),
    },
    commandHandlers: {
      [COMMAND_SEARCH]: (trigger, query) => {
        helpers.runSearchQuery(query)
          .then(data => {
            trigger('SEARCH_SUCCESS')(data.items)
          })
          .catch(error => {
            trigger('SEARCH_FAILURE')(void 0)
          });
      }
    },
    inject: new Flipping(),
    componentDidUpdate: flipping => () => {flipping.read();},
    componentWillUpdate: flipping => () => {flipping.flip();}
  }
};

const showMachine = machine => {
  const fsmSpecsWithEntryActions = decorateWithEntryActions(machine, machine.entryActions, null);
  const fsm = create_state_machine(fsmSpecsWithEntryActions, { updateState: applyJSONpatch });

  return React.createElement(Machine, {
    subjectFactory: Rx,
    preprocessor: machine.preprocessor,
    fsm: fsm,
    commandHandlers: machine.commandHandlers,
    componentWillUpdate: (machine.componentWillUpdate || noop)(machine.inject),
    componentDidUpdate: (machine.componentDidUpdate || noop)(machine.inject)
  }, null)
};

// Displays all machines (not very beautifully, but this is just for testing)
ReactDOM.render(
  div(
    Object.keys(machines).map(machine => {
      return div([
        span(machine),
        showMachine(machines[machine])
      ])
    })
  ),
  document.getElementById('root')
);

```
 
Now let's explain a bit what is going on here. 

First of all, we use `React.createElement` but you 
could just as well use jsx `<Machine ... />`, that really is but an implementation detail. In our
 implementation we are mostly using core React API and [hyperscript](https://github.com/mlmorg/react-hyperscript) rather than jsx. Then keep in mind that when we write 'the 
 machine', we refer to the state machine whose graph has been given previously. When we want to 
 refer to the `Machine` component, we will always specifically precise that.
 
Our state machine is basically a function which takes an input and returns outputs. The inputs 
received by the machine are meant to be mapped to events triggered by the user through the user 
interface. The outputs from the machine are commands representing what commands/effects to perform 
on the interfaced system(s). The mapping between user/system events and machine input is 
performed by `preprocessor`. The commands output  by the machine are mapped to handlers gathered 
in `commandHandlers` so our `Machine`  component knows how to run a command when it receives one.
 `componentWillUpdate` and `componentDidUpdate` are overriding default behaviour of the eponym 
 lifecycle hooks for the `Machine` component. 

A run of the machine would then be like this :
- The machine will encapsulate the following properties as part of its extended state : `query`, 
`items`, `photo`. This extended state will be updated according to the machine specifications in 
function of the input received by the machine and the control state the machine is in.  
- The initial extended state is `{ query: '', items: [], photo: undefined }`
- The machine transitions automatically from the initial state to the `start` control state.
  - on doing so, it issues one command : render `GalleryApp` passing it in props the relevant 
  data extracted from the extended state of the state machine. 
- The `Machine` component executes the render command and renders a gallery app with an
   empty query text input, no images(`items`), and no selected image (`photo`).
- The user enters some text in the text input
- The user clicks the `Search` button. 
  - A `submit` event is triggered.
  - The value of the input field is read, and the `submit` event is transformed into a 
  machine input `{SEARCH : <query>}` which is passed to the machine
  - The machine, per its specifications, outputs two commands : `COMMAND_SEARCH` and render 
  `GalleryApp`, and transitions to `loading` control state 
  - The `Machine` component executes the two commands : the gallery is rendered (this time with a
   `Cancel` button appearing), and an API call is made. Depending on the eventual result of that 
   API call, the command handler will trigger a `SEARCH_SUCCESS` or `SEARCH_FAILURE` event.
- The search is successful : the `SEARCH_SUCCESS` event is transformed into a machine 
input `{SEARCH_SUCCESS: items}`. 
  - The machine, per its specifications, updates its extended state `items` property, and outputs
   a render `GalleryApp` command. This displays the list of fetched items on the screen.
- Any further event will lead to the same sequence : 
  - the user or an interfaced system (network, etc.) triggers an event X,
  - that event will be transformed into a machine input (as per `preprocessor`), 
  - the machine will, as per its specs, update its extended state and issue command(s) 
  - Issued command will be executed by the `Machine` component, as per `commandHandlers`

Note that we use here the two mentioned React lifecycle hooks, as we are using the [`Flipping`](https://github.com/davidkpiano/flipping) animation library. This library exposes a `flip` API 
which must be used immediately before render (`flipping.read()`), and immediately after render 
(`flipping.flip()`). 

This is it! Whatever the machine passed as parameter to the `Machine` component, its behaviour 
will always be as described.

### Types
Types contracts can be found in the [repository](https://github.com/brucou/react-state-driven/tree/master/types). 

We only reproduce here the key types :

```javascript
// Commands
/**
 * @typedef {RenderCommand | SystemCommand} Command
 */
/**
 * @typedef {{command : COMMAND_RENDER, params : (function (trigger:RawEventDispatcher):React.Component)  }} RenderCommand
 */
/**
 * @typedef {{command : CommandName, params : * }} SystemCommand
 */
// Mediator
/**
 * @typedef {Object} MachineProps
 * @property {EventPreprocessor} [preprocessor = x=>x]
 * @property {FSM} fsm machine definition (typically events, states and transitions)
 * @property {Object.<CommandName, CommandHandler>} commandHandlers
 * @property {{Subject : SubjectFactory}} subjectFactory Subject factory. A subject is an entity which is both an
 * observer and an observable, i.e. it can both receive and emit data. A typical value for this parameter could be
 * Rx (from Rxjs).
 * The factory is called with `new`. The returned object must have all methods in `Combinators`
 */
/**
 * @typedef {function (RawEventSource) : MachineEventSource} EventPreprocessor
 */
/**
 * @typedef {function():Subject} SubjectFactory
 */
/**
 * @typedef {function(RawEventDispatcher, params : *): *} CommandHandler
 */
/**
 * @typedef {function(RawEventName):RawEventCallback} RawEventDispatcher
 */
/**
 * @typedef {function(RawEventData, React.ElementRef, ...):*} RawEventCallback
 */
/**
 * @typedef {function(Observable, ...):Observable} EventCombinator
 */
/**
 * @type {{map: EventCombinator, filter:EventCombinator, startWith:EventCombinator}} Combinators
 */
// FSM
/**
 * @typedef {function(ExtendedState, ExtendedStateUpdate): ExtendedState} ExtendedStateReducer
 */
```

### Semantics
- The `<Machine />` component :
  - initializes the raw event source (subject) which which receives and forward all raw events 
  (user  events and  system events), and the event emitter emitting on it
  - create a global command handler to dispatch to lower-level command handler
  - connects the raw event source to the preprocessor
  - connects the preprocessor to the machine
  - connects the machine to the command handler
  - starts the machine : the machine is now reactive to raw events and computes the 
  associated commands
- The preprocessor will receive raw events from two sources : the user interface and the external
 systems (databases, etc.). From raw events, it will compute inputs for the connected state 
 machine. Note that :
  - the preprocessor may perform effects only on the user interface (for instance `e => e.preventDefault()`
  - the preprocessor may have its own internal state
- The machine receives preprocessed events from the preprocessor and computes a set of commands 
to be executed
- The global command handler execute the incoming commands :
  - if the command is a render command, the global handler execute directly the command in the 
  context of the `<Machine/>` component
  - if the command is not a render command, the global handler dispatches the command to the 
  preconfigured command handlers
- All command handlers are passed the raw event source emitter, so they can send back events
  - Render commands leads to definition of React components with event handlers. Those event 
  handlers can pass their raw events to the machine thanks to the raw event source emitter
  - Non-render commands leads to the execution of procedures which may be successful or fail. The
   command handler can pass back information to the machine thanks to the raw event source emitter.
- The event source is created with the subject factory passed as parameters. That subject must 
have the `next, complete, error` properties defined (`Observer` interface), the properties 
`subscribe` defined (`Observable` interface), and at least three operators (`map, filter, 
startWith`). Rx from `Rxjs` is a natural choice, but other reactive libraries can be easily 
adapted, including standard simple event emitters or callbacks.

# Tips and gotchas
- most of the time `preprocessor` will just change the name of the event. You can 
perfectly if that makes sense, use `preprocessor : x => x` and directly pass on the raw 
events to the machine as input. That is fine as long as the machine never has to perform an 
effect (this is one of the machine's contract). In our example, you will notice that we are doing
 `e.persist()`, so our example does not qualify for such a simplification of 
 `preprocessor`. Furthermore, for documentation and design purposes, it makes sense to use 
 any input nomenclature which links to the domain rather than the user interface. As we have 
 seen, what is a click on a button is a search intent to the machine, and results in a search 
 command to the command handler. 
- some machine inputs correspond to the aggregation of several events. For instance, if we had to
 recreate a double click for the `Search` button, we would to receive two clicks before passing a 
 `SEARCH` input to the machine. We use `Rxjs` to deal with those cases, as its combinator library
  (`map`, `filter`, `takeUntil` etc.) allow to aggregate events in a fairly simple manner. Note 
  that we could implement this logic in the state machine itself (our machines are 
  turing-machine-equivalent, they can implement any effect-less computation), but : 1. it is much 
  better to keep the machine dealing with inputs at a higher level of abstraction, 2. that kind 
  of event aggregation is **much easier** done with a dedicated library such as `rxjs` 
- In our example, we render always the same component. This is because our image search app only 
has one screen which the `GalleryApp` renders. In application with several screens, we could use 
control states corresponding to specific screens, and have the relevant render commands generated
 in `entryActions` according to the control state the machine is in.
- the interfaced systems can communicate with the machine via a `trigger` event emitter. As such 
any relevant raw event should be associated to an event handler obtained through `trigger`. The 
`trigger` event emitter is passed as parameter by the `Machine` component to any function props 
who may need it. For instance the `GalleryApp` component is written as follows :

```javascript
  render() {
    const { query, photo, items, trigger, gallery: galleryState } = this.props;

    return div(".ui-app", { 'data-state': galleryState }, [
      h(Form, { galleryState, onSubmit: trigger('onSubmit'), onClick: trigger('onCancelClick') }, []),
      h(Gallery, { galleryState, items, onClick: trigger('onGalleryClick') }, []),
      h(Photo, { galleryState, photo, onClick: trigger('onPhotoClick') }, [])
    ])
  }
```

# Further examples
All demo from examples can be found in the [demo repository](https://github.com/brucou/react-app-simple) 

## Controlled form
This example is a simple form input which will trigger a render on submit. It illustrates how to 
handle controlled components at the preprocessing level.

```javascript

const machines = {
  controlledForm: {
    preprocessor: rawEventSource => rawEventSource.map(ev => {
      const { rawEventName, rawEventData } = destructureEvent(ev);

      if (rawEventName === INPUT_CHANGED) {
        return { [INPUT_CHANGED]: rawEventData.target.value }
      }
      else if (rawEventName === KEY_PRESSED) {
        return rawEventData.key === KEY_ENTER
          ? { [ENTER_KEY_PRESSED]: void 0 }
          : NO_INTENT
      }

      return NO_INTENT
    })
      .filter(x => x !== NO_INTENT),
    entryActions: {
      A: (extendedState, eventData, fsmSettings) => {
        const { value, placeHolder } = extendedState;

        return renderAction(trigger => h(Input, {
          value, placeHolder, onKeyPress: trigger(KEY_PRESSED), onChange: trigger(INPUT_CHANGED)
        }))
      },
      B: (extendedState, eventData, fsmSettings) => {
        const { value: text } = extendedState;

        return renderAction(trigger => h(TextMessage, { text }, []))
      }
    },
    states: { A: '', B: '' },
    events: [BUTTON_CLICKED, INPUT_CHANGED, ENTER_KEY_PRESSED],
    transitions: [
      { from: INIT_STATE, event: INIT_EVENT, to: 'A', action: NO_ACTIONS },
      {
        from: 'A', event: INPUT_CHANGED, to: 'A', action: (extendedState, eventData, fsmSettings) => {
          const value = eventData;

          return {
            outputs: NO_OUTPUT,
            updates: [{ op: 'add', path: '/value', value }]
          }
        }
      },
      {
        from: 'A', event: ENTER_KEY_PRESSED, to: 'B', action: NO_ACTIONS
      },
    ],
    initialExtendedState: { placeHolder: 'Enter some text', value: '' }
  },
}
```

## Uncontrolled form with ref
This example is a simple form input which will trigger a render on submit. It illustrates how to 
handle uncontrolled components at the preprocessing level.

```javascript
export class InputWithExplicitRef extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    const Component = this;
    const { onKeyPress, placeHolder } = Component.props;
    const onKeyPressWithRef = ev => onKeyPress(ev, this.inputRef);

    return input({ ref: this.inputRef, placeholder: placeHolder, type: "text", onKeyPress: onKeyPressWithRef }, [])
  }
}

const machines = {
  uncontrolledFormWithExplicitRef: {
    preprocessor: rawEventSource => rawEventSource
      .map(ev => {
        const { rawEventName, rawEventData, ref } = destructureEvent(ev);

        if (rawEventName === KEY_PRESSED) {
          return rawEventData.key === KEY_ENTER
            ? { [ENTER_KEY_PRESSED]: ref.current.value }
            : NO_INTENT
        }
        return NO_INTENT
      })
      .filter(x => x !== NO_INTENT),
    entryActions: {
      A: (extendedState, eventData, fsmSettings) => {
        const { placeHolder } = extendedState;

        return renderAction(trigger => h(InputWithExplicitRef, { placeHolder, onKeyPress: trigger(KEY_PRESSED) }))
      },
      B: (extendedState, eventData, fsmSettings) => {
        const { entered: text } = extendedState;

        return renderAction(trigger => h(TextMessage, { text }, []))
      }
    },
    states: { A: '', B: '' },
    events: [BUTTON_CLICKED, ENTER_KEY_PRESSED],
    transitions: [
      { from: INIT_STATE, event: INIT_EVENT, to: 'A', action: NO_ACTIONS },
      {
        from: 'A', event: ENTER_KEY_PRESSED, to: 'B', action: (extendedState, eventData, fsmSettings) => {
          const value = eventData;

          return {
            outputs: NO_OUTPUT,
            updates: [{ op: 'add', path: '/entered', value }]
          }
        }
      },
    ],
    initialExtendedState: { placeHolder: 'Enter some text', entered: '' }
  }
}
```

# Testing
Coming soon!

# Prior art
- [React automata](https://github.com/MicheleBertoli/react-automata)
- [react-xstate-js](https://github.com/bradwoods/react-xstate-js)
