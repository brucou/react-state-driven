- [Motivation](#motivation)
- [Modelling user interfaces with state machines](#modelling-user-interfaces-with-state-machines)
- [Installation](#installation)
- [API design goals](#api-design-goals)
- [API](#api)
  * [` <Machine fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, componentDidUpdate, componentWillUpdate />`](#---machine-fsm--eventhandler--preprocessor--commandhandlers--effecthandlers--componentdidupdate--componentwillupdate----)
    + [Description](#description)
    + [Example](#example)
    + [Types](#types)
    + [Contracts](#contracts)
    + [Semantics](#semantics)
  * [`testMachineComponent(testAPI, testScenario, machineDefinition)`](#-testmachinecomponent-testapi--testscenario--machinedefinition--)
    + [Description](#description-1)
    + [Types](#types-1)
    + [Contracts](#contracts-1)
    + [Semantics](#semantics-1)
- [Tips and gotchas](#tips-and-gotchas)
- [Further examples](#further-examples)
- [Testing](#testing)
  * [Testing the state machine](#testing-the-state-machine)
    + [Scenario generation](#scenario-generation)
    + [Expected output sequences](#expected-output-sequences)
    + [Comparison](#comparison)
    + [Results](#results)
  * [Testing the component](#testing-the-component)
    + [Test attributes](#test-attributes)
    + [Mocking effects](#mocking-effects)
    + [From test input sequence to events](#from-test-input-sequence-to-events)
    + [Test assertion](#test-assertion)
  * [Additional considerations](#additional-considerations)
- [Prior art and useful references](#prior-art-and-useful-references)

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
> `sinon` should be imported if one wants to use the testing API

```sh
npm install react-state-driven
```

# API design goals
We want to have an integration which is generic enough to accommodate a large set of use cases, 
and specific enough to be able to take advantage as much as possible of the `React` ecosystem 
and API. Unit-testing should ideally be based on the specifications of the behaviour of the 
component rather than its implementation details, and leverage the automatic test generator of 
the underlying `state-tranducer` library. In particular :

- it should be seamless to use both controlled and uncontrolled components
- it should be possible to use without risk of interference standard React features like `Context`
- it should use the absolute minimum React features internally, in order to favor for instance a 
painless port to React copycats (Preact, etc.)
- non-React functionalities should be coupled only through interfaces, allowing to use any 
suitable implementation
- the specifics of the implementation should not impact testing (hooks, suspense, context, etc.)

As a result of these design goals :
- we do not use React context, portal, fragments, `jsx`, and use the minimum React lifecycle hooks
- the component user can of course use the whole extent of the API at disposal, those restrictions 
only concern our implementation of the `<Machine />` component.
- we defined interfaces for extended state updates (reducer interface), event processing 
(observer and observable interfaces).
- any state machine implementation can be substituted to our library provided that :
  - it implements a `.yield` method
  - it produces no effects
  - it returns an array of commands (implementation relying on callback or event hooks cannot be 
  integrated)
- we use dependency injection to pass the modules responsible for effects to the `<Machine 
/>` component

# API
## ` <Machine fsm, eventHandler, preprocessor, commandHandlers, effectHandlers, componentDidUpdate, componentWillUpdate />`

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

![machine visualization](assets/image%20gallery%20state%20cat.png)

The live example [can be accessed here](https://frontarm.com/demoboard/?id=61be6ab3-9542-4eac-a30c-a6b4fa6ffbfa).

So we have the machine specifying the behaviour of our image search. Let's see how to integrate 
that with React using our `Machine` component.

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
      initialExtendedState: { query: "", items: [], photo: undefined, gallery: "" },
      states: { start: "", loading: "", gallery: "", error: "", photo: "" },
      events: ["SEARCH", "SEARCH_SUCCESS", "SEARCH_FAILURE", "CANCEL_SEARCH", "SELECT_PHOTO", "EXIT_PHOTO"],
      preprocessor: rawEventSource => rawEventSource.pipe(
        map(ev => {
          const { rawEventName, rawEventData: e, ref } = destructureEvent(ev);
    
          if (rawEventName === INIT_EVENT) {
            return { [INIT_EVENT]: void 0 };
          }
          // Form raw events
          else if (rawEventName === "onSubmit") {
            e.persist();
            e.preventDefault();
            return { SEARCH: ref.current.value };
          }
          else if (rawEventName === "onCancelClick") {
            return { CANCEL_SEARCH: void 0 };
          }
          // Gallery
          else if (rawEventName === "onGalleryClick") {
            const item = e;
            return { SELECT_PHOTO: item };
          }
          // Photo detail
          else if (rawEventName === "onPhotoClick") {
            return { EXIT_PHOTO: void 0 };
          }
          // System events
          else if (rawEventName === "SEARCH_SUCCESS") {
            const items = e;
            return { SEARCH_SUCCESS: items };
          }
          else if (rawEventName === "SEARCH_FAILURE") {
            return { SEARCH_FAILURE: void 0 };
          }
    
          return NO_INTENT;
        }),
        filter(x => x !== NO_INTENT)
      ),
      transitions: [
        { from: INIT_STATE, event: INIT_EVENT, to: "start", action: NO_ACTIONS },
        { from: "start", event: "SEARCH", to: "loading", action: NO_ACTIONS },
        {
          from: "loading", event: "SEARCH_SUCCESS", to: "gallery", action: (extendedState, eventData, fsmSettings) => {
            const items = eventData;
    
            return {
              updates: [{ op: "add", path: "/items", value: items }],
              outputs: NO_OUTPUT
            };
          }
        },
        { from: "loading", event: "SEARCH_FAILURE", to: "error", action: NO_ACTIONS },
        { from: "loading", event: "CANCEL_SEARCH", to: "gallery", action: NO_ACTIONS },
        { from: "error", event: "SEARCH", to: "loading", action: NO_ACTIONS },
        { from: "gallery", event: "SEARCH", to: "loading", action: NO_ACTIONS },
        {
          from: "gallery", event: "SELECT_PHOTO", to: "photo", action: (extendedState, eventData, fsmSettings) => {
            const item = eventData;
    
            return {
              updates: [{ op: "add", path: "/photo", value: item }],
              outputs: NO_OUTPUT
            };
          }
        },
        { from: "photo", event: "EXIT_PHOTO", to: "gallery", action: NO_ACTIONS }
      ],
      entryActions: {
        loading: (extendedState, eventData, fsmSettings) => {
          const { items, photo } = extendedState;
          const query = eventData;
          const searchCommand = { command: COMMAND_SEARCH, params: query };
          const renderGalleryAction = renderAction(trigger =>
            h(GalleryApp, { query, items, trigger, photo, gallery: "loading" }, [])
          );
    
          return {
            outputs: [searchCommand, renderGalleryAction.outputs],
            updates: []
          };
        },
        photo: renderGalleryApp("photo"),
        gallery: renderGalleryApp("gallery"),
        error: renderGalleryApp("error"),
        start: renderGalleryApp("start")
      },
      effectHandlers: { runSearchQuery },
      commandHandlers: {
        [COMMAND_SEARCH]: (obs, { runSearchQuery }) => {
          return obs.pipe(switchMap(({ trigger, params }) => {
            const query = params;
            return runSearchQuery(query)
              .then(data => {
                trigger("SEARCH_SUCCESS")(data.items);
              })
              .catch(error => {
                trigger("SEARCH_FAILURE")(void 0);
              });
          }));
        }
      },
      inject: new Flipping(),
      componentWillUpdate: flipping => (machineComponent, prevProps, prevState, snapshot, settings) => {flipping.read();},
      componentDidUpdate: flipping => (machineComponent, nextProps, nextState, settings) => {flipping.flip();},
  }
};

const showMachine = machine => {
  const fsmSpecsWithEntryActions = decorateWithEntryActions(machine, machine.entryActions, null);
  const fsm = create_state_machine(fsmSpecsWithEntryActions, { updateState: applyJSONpatch });

  return React.createElement(Machine, {
    eventHandler: stateTransducerRxAdapter,
    preprocessor: machine.preprocessor,
    fsm: fsm,
    commandHandlers: machine.commandHandlers,
    componentWillUpdate: (machine.componentWillUpdate || noop)(machine.inject),
    componentDidUpdate: (machine.componentDidUpdate || noop)(machine.inject)
  }, null)

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
  - on doing so, it issues one command : render `GalleryApp`. Render commands have a default 
  handler which renders the `React.Element` passed as parameter. That element can be computed 
  from the extended state of the state machine and the event data. An event emitter (here `trigger`)
   is passed to allow for the element to send events to the state machine : 
```javascript
  export function renderAction(params) {
    return { outputs: { command: COMMAND_RENDER, params }, updates: NO_STATE_UPDATE }
  }
  export function renderGalleryApp(galleryState) {
    return (extendedState, eventData, fsmSettings) => {
      const { query, items, photo } = extendedState;
  
      return renderAction(trigger => h(GalleryApp, { query, items, photo, trigger, gallery: galleryState }, []));
    }
  }
```
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

Note that we are using `switchMap` from our event processing library to handle for us the 
concurrency issues related to outdated requests (i.e. cancelled requests whose 
response nevertheless arrive). We could handle that in the state machine but we
 do it here, as it otherwise complicates needlessly the machine.

Note that we use here the two mentioned React lifecycle hooks, as we are using the [`Flipping`](https://github.com/davidkpiano/flipping) animation library. This library exposes a `flip` API 
which must be used immediately before render (`flipping.read()`), and immediately after render 
(`flipping.flip()`). 

This is it! Whatever the machine passed as parameter to the `Machine` component, its behaviour 
will always be as described.

### Types
Types contracts can be found in the [repository](https://github.com/brucou/react-state-driven/tree/master/types). 

Let's just say here that adapting an event processing library is the most complicated to 
interface. Here is for example a Rxjs adapter used for the demo with `react-state-driven` :

```javascript
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { filter, flatMap, map, shareReplay, startWith } from "rxjs/operators";

const stateTransducerRxAdapter = {
  // NOTE : this is start the machine, by sending the INIT_EVENT immediately prior to any other
  subjectFactory: () => new BehaviorSubject([INIT_EVENT, void 0]),
  merge: merge,
  create: fn => Observable.create(fn),
  startWith : startWith,
  filter: filter,
  map: map,
  flatMap: flatMap,
  shareReplay: shareReplay
};

```

### Contracts
- the `[COMMAND_RENDER]` command is reserved and must not be used in the command handlers' 
specifications  
- types contracts
- the chosen machine instance must accept a predefined init event (`INIT_EVENT`). That event will be 
sent when the `<Machine/>` component is first mounted (`componentDidMount` React lifecycle method). 

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
- All command handlers are passed two arguments : 
  - an observable containing 
    - the raw event source emitter, so they can send back events, 
    - the `params` property of commands to be processed by the handler
  - an object of type `EffectHandlers` which contains any relevant dependencies needed to 
  perform effects (that is the object passed in props to the `<Machine/>` component)
- Render commands leads to definition of React components with event handlers. Those event 
  handlers can pass their raw events to the machine thanks to the raw event source emitter
- Non-render commands leads to the execution of procedures which may be successful or fail. The
   command handler can pass back information to the machine thanks to the raw event source 
   emitter.
- The event source is created with the subject factory passed as parameters. That subject must 
have the `next, complete, error` properties defined (`Observer` interface), the properties 
`subscribe` defined (`Observable` interface), and at least five operators (`map`, `filter`, `flatMap`, 
`startWith`, `shareReplay`). Rx from `Rxjs` is a natural choice, but other reactive libraries can be 
easily adapted, including standard simple event emitters or callbacks.
- The event source is terminated when the `<Machine/>` component is removed from the screen 
(`componentWillUnmount` lifecycle method)

## `testMachineComponent(testAPI, testScenario, machineDefinition)`
### Description
The `testMachineComponent` function runs a set of test cases on a React `<Machine/>` component 
which wraps around an underlying state machine defining its behaviour. The tests are run entirely
 in the browser. The test framework is QUnit for the test runs, and `react-testing-library` for 
 handling the React component.

A test case is an input sequence, and a matching expected output sequence. The input sequence is 
a ordered set of inputs for the underlying state machine, and the matching output sequence is the
 outputs of the machine corresponding to the input sequence. Because any underlying state machine
  will always produce an output for any given input, input sequence and output sequence have the 
  same length, and given an index `i`, the output at index `i` is the output of the machine for 
  the input sequence at index `i`. Lastly, we remind that the state machine outputs **array of 
  values** for each input it receives.

This implicitly means that tests for the underlying state machine are reused for the `<Machine/>` 
component, which in turn means that the underlying state machine has to be tested first, and then
 the React component.

Because input sequences and output sequences are with respect to the underlying state machine, they
 have to be converted to :

- event sequences which represent/simulate the actions of a user on the user interface, or the 
 events received by the React component by interfaced systems
- assertion sequences which check that the simulated event has the expected effect.

Because we are unit-testing, we do not want to perform effects on the interfaced 
systems (other than the user acting on the user interface), and as a result, a the 
`testMachineComponent` function incorporates a mocking mechanism.

Finally, we run the test in the browser, with actual display of the component in the browser in 
order to facilitate debugging activities. As a result, it is necessary to provide an anchoring 
DOM element to display the component.  

In short, the testing methodology can be summarized as follows:

```ejs
Fsm testing : input seq. => fsm (black box) => output seq.

Component testing : (input seq. =>) event seq. => component (black box) => assert seq. (<= output seq.)
```


### Types
In the frame of testing with QUnit, and `react-testing-library`, which are the hypothesis for 
this function, testAPI is fixed and must be :

```javascript
import * as rtl  from "react-testing-library";

const testAPI = {
  test: QUnit.test.bind(QUnit),
  rtl
};
```

For the definition of `MachineDefinition`, `TestScenario` cf. [repository](https://github.com/brucou/react-state-driven/blob/master/types/react-fsm-integration.js)

### Contracts
- input sequence and output sequence have same length
- output sequence = state machine run (input sequence)
- type contracts

### Semantics
For each test case/input sequence :

- the fsm under test is created with mocked effect handlers
  - using the `mockedEffectHandlers`, `mockedMachineFactory`, `machineDef`, `mocks` properties 
  passed with the parameters
- for each input in the input sequence :
  - the corresponding event is computed and run
    - as deduced from the `when` property of `testScenario`
    - the `when` function is passed all the data necessary for it to perform its function, cf. types
  - the corresponding assertion is computed and chained to the previous event simulation
    - as deduced from the `then` property of `testScenario`
    - the `then` function is passed all the data necessary for it to perform its function, cf. types
    - event simulations returning promises are chained seamlessly
  - errors are caught and logged both in the console and in the QUnit reporter (tests are not interrupted)
      
After each test case, the DOM anchor is emptied (`React.render(null, ...)`).

## getStateTransducerRxAdapter(RxApi)

```javascript
import { filter, flatMap, map, shareReplay, switchMap } from "rxjs/operators";
import { BehaviorSubject, merge, Observable } from "rxjs";

export const getStateTransducerRxAdapter = RxApi => {
  const { BehaviorSubject, merge, Observable, filter, flatMap, map, shareReplay } = RxApi;

  return {
    // NOTE : this is start the machine, by sending the INIT_EVENT immediately prior to any other
    subjectFactory: () => new BehaviorSubject([INIT_EVENT, void 0]),
    // NOTE : must be bound, because, reasons
    merge: merge,
    create: fn => Observable.create(fn),
    filter: filter,
    map: map,
    flatMap: flatMap,
    shareReplay: shareReplay
  };
};

```

# Tips and gotchas
- If the configured state machine library has an initial event, it can be passed using a behavior
 subject (subject with an initial value). In that case, the `preprocessor` must be configured to 
 handle that initial event. Cf. examples
- most of the time `preprocessor` will just change the name of the event. You can 
perfectly if that makes sense, use `preprocessor : x => x` and directly pass on the raw 
events to the machine as input. That is fine 
  - as long as the machine never has to perform an effect (this is one of the machine's contract)
  . In our example, you will notice that we are doing `e.persist()`, so our example does not 
  qualify for such a simplification of  `preprocessor`. Furthermore, for documentation and design
   purposes, it makes sense to use any input nomenclature which links to the domain rather than 
   the user interface. As we have seen, what is a click on a button is a search intent to the 
   machine, and results in a search command to the command handler. 
  - if that machine is only designed for that user interface and not intended to be reused in any
   other context. This approach as a matter of fact couple the view to the machine. In the case of
    our image gallery component, we could imagine a reusable parameterizable machine which 
    implements the behaviour of a generic search input. Having a preprocessor enables to 
    integrate such machines without a hiccup, while still disappearing out of the picture if not 
    needed.
- some machine inputs may correspond to the aggregation of several events (in advanced usage). For 
instance, if we had to recreate a double click for the `Search` button, we would have to receive 
two clicks before passing a `SEARCH` input to the machine. We use `Rxjs` to deal with those 
cases, as its combinator library (`map`, `filter`, `takeUntil` etc.) allow to aggregate events in
 a fairly simple manner. Note that we could implement this logic in the state machine itself (our
  machines are turing-machine-equivalent, they can implement any effect-less computation), but : 
  1. it is much better to keep the machine dealing with inputs at a consistent level of 
  abstraction; 2. that kind of event aggregation is **much easier** done with a dedicated 
  library such as `rxjs`
- Likewise, do not hesitate when possible to handle concurrency issues with the event processing 
library. In our example, we used `switchMap` which only emits the response from the latest 
request. Doing this in the machine, while possible, would needlessly complicate the design, and 
lower the level of abstraction at which the machine operates
- the interfaced systems can communicate with the machine via a `trigger` event emitter. As such, 
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
All demos from examples can be found in the [demo repository](https://github.com/brucou/react-app-simple) :
- hello world
- controlled form
- uncontrolled form with ref
- image search app


# Testing
As we mentioned previously, the `<Machine/>` mediator is made from the monadic composition of four 
configurable units : `event handler -> preprocessor -> state machine -> command handler`. 
White-box testing of the configured component hence involves testing each of the aforementionned
 modules separately. Black-box testing of the configured component involves simulating, according 
 to the component configuration, incoming events and observing the responses of the component to 
 those events.

White-box testing of the individual units composing the component is an attractive option for its
 relative simplicity. The pre-processor (often a pure function of streams) and command handler 
 (easy to mock) are relatively easy to test. The state machine itself already has a dedicated 
 automated test cases generation. Testing the event handler means recreating a large enough set 
 of possible views generated by the component, simulating  user inputs and checking that the 
 right events are passed to the pre-processor. There is no need to 
  further test the integration between units : the mediator is the one doing that integration 
  and it ~comes~ should come already tested. On the flip side, white-box testing involves what are 
  implementation details. A change in implementation with unchanged specifications is likely to 
  lead to rewriting some of the tests. Additionally, our white-box hypothesis might be incorrect 
  (`<Machine />` mediator buggy, preprocessor correctly written but to the wrong specifications 
  etc.). This means the confidence in this method is the lower bound of the confidence in our 
  hypothesis.

Black-box testing the component can be done in two phases : first testing the state machine 
through automatically generated test sequences, then deriving from those machine test sequences 
the corresponding component test sequences for the component under test. Once sufficient 
confidence has been attained about the state machine correct behaviour, the output of the machine
 can be used as oracle to predict the output of the component. That testing approach is more 
 complex to implement. While both testing approaches involve testing the state machine, writing 
 component tests requires more complex mocking, mapping the machine's abstract test sequence to 
 the component's concrete test sequence (click a button, submit a form, etc.), and carefully 
 orchestrating the dance of user events simulation and output observation. On the bright side, 
 the black-box approach generates more confidence and less brittle tests : we are directly testing 
 against the specifications.  

We will showcase here the black-box testing approach applied to the image search gallery. The 
testing approach consists of two consecutive steps : testing the state machine, and testing the 
component. 

## Testing the state machine
Testing the machine involves :
- generating test scenarios
- compute for each scenario the expected output
- compute the actual output from the test scenarios
- compare actual output vs. expected output

### Scenario generation
Testing the machine is testing a causal function. The corresponding testing procedure is thus 
simple : generate input sequences, and validate output sequences. A test scenario is thus a couple 
made of an input sequence and the expected output sequence. The test space for such test scenari 
being naturally infinite, example-based testing techniques can thus never exhaustively cover it. 
It is then necessary to pick up a partial coverage criteria adapted to our confidence 
requirement level. 

We obviously want to cover the main paths of the image search (search queries, display of 
results, photo selection). We also want to test the concurrent behaviour of our search application :
 in case of concurrent queries, only the result of the most recent one should be considered. We 
 also want to cover all the transition of the machines (search error, cancellation, etc. ). 

To that purpose and because we have a relatively small state machine, we thus decide to use a 
`All-2-transitions` model coverage criteria, with a `gallery` target state. This means we will 
examine the application behaviour on the paths for which no edges are repeated more than twice, 
and the path ends in the `gallery` control state.

To use our test sequences generator, we need to indicate, for each possible control state, 
transition from that control state, value of the machine's extended state: whether it is possible
 to generate an input which triggers that transition, and if possible, suggests such an input. In 
 the present case, we keep track of the queries performed and pending, so that we do not repeat 
 the same search twice, except if the search failed.

Lastly, the configuration for our test generation has the same shape as the state machine under 
test. A good practice is to copy paste the configuration of the machine under test and add the 
`gen` fields which describe the computation of test inputs. 

With this, we have all the information required to use the test generator.  

```javascript
  const genFsmDef = {
    transitions: [
      {
        from: INIT_STATE, event: INIT_EVENT, to: 'start',
        gen: constGen(void 0, { pending: [], done: [], current: null })
      },
      {
        from: 'start', event: 'SEARCH', to: 'loading',
        gen: constGen(searchQueries[0], { pending: [searchQueries[0]], done: [] })
      },
      {
        from: 'loading', event: 'SEARCH_SUCCESS', to: 'gallery', gen: (extS, genS) => {
          // Assign success to a random query, if any
          const { pending, done } = genS;
          const hasPendingQueries = pending.length !== 0;
          const alea = Math.random();
          const indexSuccessfulQuery = Math.round(alea * (pending.length - 1))
          const input = hasPendingQueries
            ? searchFixtures[pending[indexSuccessfulQuery]]
            : null;
          const generatorState = hasPendingQueries
            // Remove the successful query from the list of pending queries
            ? {
              pending: pending.filter((_, index) => index !== indexSuccessfulQuery),
              done: done.concat(pending[indexSuccessfulQuery]),
              current: pending[indexSuccessfulQuery]
            }
            : genS;

          return { hasGeneratedInput: hasPendingQueries, input, generatorState }
        }
      },
      {
        from: 'loading', event: 'SEARCH_FAILURE', to: 'error', gen: (extS, genS) => {
          const { pending, done } = genS;
          const hasPendingQueries = pending.length !== 0; // should always be true here by construction
          const alea = Math.random();
          const indexErroneousQuery = Math.round(alea * (pending.length - 1));

          return {
            hasGeneratedInput: hasPendingQueries, input: void 0,
            generatorState: {
              pending: pending.filter((_, index) => index !== indexErroneousQuery),
              done: done
            }
          }
        }
      },
      {
        from: 'loading', event: 'CANCEL_SEARCH', to: 'gallery',
        gen: (extS, genS) => {
          // Cancel always relates to the latest search. However that search must remain in the list of pending
          // queries as the corresponding API call is in fact not cancelled
          // We do not repeat the cancelled query and consider it done, and not pending
          const { pending, done } = genS;
          const hasPendingQueries = pending.length !== 0; // should always be true here by construction
          return {
            hasGeneratedInput: hasPendingQueries, input: void 0,
            generatorState: { pending: pending.slice(0, -1), done: done.concat(pending[pending.length - 1]) }
          }
        }
      },
      {
        from: 'error', event: 'SEARCH', to: 'loading', gen: (extS, genS) => {
          // Next query is among the queries, not done, and not pending.
          const { pending, done } = genS;
          const possibleQueries = searchQueries.filter(query => !done.includes(query) && !pending.includes(query));

          return {
            hasGeneratedInput: possibleQueries.length > 0, input: possibleQueries[0],
            generatorState: { pending: pending.concat(possibleQueries[0]), done: genS.done }
          }
        }
      },
      {
        from: 'gallery', event: 'SEARCH', to: 'loading', gen: (extS, genS) => {
          // Next query is the next one in the query search array.
          const { pending, done } = genS;
          const possibleQueries = searchQueries.filter(query => !done.includes(query) && !pending.includes(query));

          return {
            hasGeneratedInput: possibleQueries.length > 0, input: possibleQueries[0],
            generatorState: { pending: pending.concat(possibleQueries[0]), done: genS.done }
          }
        }
      },
      {
        from: 'gallery', event: 'SELECT_PHOTO', to: 'photo', gen: (extS, genS) => {
          // we have four pictures for each query in this test setup. So we just pick one randomly
          // the query for the selected photo is the latest done query
          const { pending, done, current } = genS;
          const indexPhoto = Math.round(Math.random() * 3);
          const query = done[done.length - 1];

          return { hasGeneratedInput: current, input: searchFixtures[query][indexPhoto] }
        }
      },
      { from: 'photo', event: 'EXIT_PHOTO', to: 'gallery', gen: constGen(void 0) }
    ],
  };

```

We get input sequences for the following 27 paths : 

```javascript
[
  "nok -> start -> loading -> gallery -> loading -> gallery",
  "nok -> start -> loading -> gallery -> loading -> error -> loading -> gallery",
  "nok -> start -> loading -> gallery -> loading -> error -> loading -> error -> loading -> gallery",
  "nok -> start -> loading -> gallery -> photo -> gallery -> loading -> gallery",
  "nok -> start -> loading -> gallery -> photo -> gallery -> loading -> error -> loading -> gallery",
  "nok -> start -> loading -> gallery -> photo -> gallery -> loading -> error -> loading -> error -> loading -> gallery",
  "nok -> start -> loading -> gallery -> photo -> gallery -> photo -> gallery",
  "nok -> start -> loading -> error -> loading -> gallery -> loading -> gallery",
  "nok -> start -> loading -> error -> loading -> gallery -> loading -> error -> loading -> gallery",
  "nok -> start -> loading -> error -> loading -> gallery -> photo -> gallery -> loading -> gallery",
  "nok -> start -> loading -> error -> loading -> gallery -> photo -> gallery -> loading -> error -> loading -> gallery",
  "nok -> start -> loading -> error -> loading -> gallery -> photo -> gallery -> photo -> gallery",
  "nok -> start -> loading -> error -> loading -> error -> loading -> gallery -> loading -> gallery",
  "nok -> start -> loading -> error -> loading -> error -> loading -> gallery -> photo -> gallery -> loading -> gallery",
  "nok -> start -> loading -> error -> loading -> error -> loading -> gallery -> photo -> gallery -> photo -> gallery",
  "nok -> start -> loading -> error -> loading -> error -> loading -> gallery -> loading -> gallery -> photo -> gallery -> photo -> gallery",
  "nok -> start -> loading -> error -> loading -> error -> loading -> gallery -> loading -> gallery",
  "nok -> start -> loading -> error -> loading -> gallery -> loading -> gallery -> photo -> gallery -> photo -> gallery",
  "nok -> start -> loading -> error -> loading -> gallery -> loading -> error -> loading -> gallery -> photo -> gallery -> photo -> gallery",
  "nok -> start -> loading -> error -> loading -> gallery -> loading -> error -> loading -> gallery",
  "nok -> start -> loading -> error -> loading -> gallery -> loading -> gallery",
  "nok -> start -> loading -> gallery -> loading -> gallery -> photo -> gallery -> photo -> gallery",
  "nok -> start -> loading -> gallery -> loading -> error -> loading -> gallery -> photo -> gallery -> photo -> gallery",
  "nok -> start -> loading -> gallery -> loading -> error -> loading -> error -> loading -> gallery -> photo -> gallery -> photo -> gallery",
  "nok -> start -> loading -> gallery -> loading -> error -> loading -> error -> loading -> gallery",
  "nok -> start -> loading -> gallery -> loading -> error -> loading -> gallery",
  "nok -> start -> loading -> gallery -> loading -> gallery"
];
``` 

### Expected output sequences
In the expected output sequences, we will have all the commands to be realized on the interfaced 
systems. Here there are only two interfaced systems and two commands : render to the UI, and API 
call to `flickr`.

Render commands are dealt with as a special case : they feature a function 
which eventually computes a React element to be rendered. We **DO NOT test the React component** 
wrapping the element at this level. We simply test against the `props` of that component as they 
describe entirely the visual appearance of that component (i.e. the component only depends on 
`props` for its render concern - no state, no context). This makes for a very straight forward testing. The fact that 
the component does not have state is not fortuitous - we know the control state (and extended state)
 in which we are rendering, so we can pass the useful portions of that state as props and have a 
 stateless component. This allows for an  implementation worklow similar to that of the designer,
  who naturally provides different versions of the art board, according to the anticipated states of the UI (cf. [pure UI](https://rauchg.com/2015/pure-ui)). 
 
Note that the React component still has to be tested, but that can be done separately, by any of
 the usual React specific testing techniques ([storybook](https://storybook.js.org/) is a nice way
  to do that, specially with stateless components). You can also separately use `jest` and its 
  snapshot feature, if that is deemed useful. The idea as always is to use **the best tool 
  available to each purpose**.

We compute the expected output sequences by reducing over the input sequence and keeping track of
 the relevant piece of state generated by the former processing of inputs. It goes like this :

```javascript
  const expectedOutputSequences = inputSequences
    .map(inputSequence => {
      return inputSequence.reduce((acc, input) => {
        const assign = Object.assign.bind(Object);
        const defaultProps = { query: '', items: [], photo: undefined, gallery: '', trigger: spyTrigger.name };
        const { outputSeq, state } = acc;
        const { pendingQuery, currentItems, currentPhoto } = state;
        const event = Object.keys(input)[0];
        const eventData = input[event];

        function searchCommand(query) {
          return { "command": COMMAND_SEARCH, "params": query }
        }

        switch (event) {
          case INIT_EVENT:
            return {
              outputSeq: outputSeq.concat([
                [null, {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, { gallery: 'start' })
                }]
              ]),
              state: { pendingQuery: '', currentItems, currentPhoto }
            }
          case 'SEARCH' :
            return {
              outputSeq: outputSeq.concat([
                [null, searchCommand(eventData), {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, {
                    gallery: 'loading',
                    items: currentItems,
                    query: eventData,
                    photo: currentPhoto
                  })
                }]
              ]),
              state: { pendingQuery: eventData, currentItems, currentPhoto }
            }
          case 'SEARCH_SUCCESS' :
            const items = searchFixtures[pendingQuery];
            if (items) {
              return {
                outputSeq: outputSeq.concat([
                  [null, {
                    command: COMMAND_RENDER,
                    params: assign({}, defaultProps, { gallery: 'gallery', items, photo: currentPhoto })
                  }]
                ]),
                state: { pendingQuery: '', currentItems: items, currentPhoto }
              }
            }
            else {
              return {
                outputSeq: outputSeq.concat([null]),
                state: state
              }
            }
          case 'SEARCH_FAILURE' :
            return {
              outputSeq: outputSeq.concat([
                [null, {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, { gallery: 'error', items: currentItems, photo: currentPhoto })
                }]
              ]),
              state: { pendingQuery: '', currentItems, currentPhoto }
            };
          case 'CANCEL_SEARCH' :
            return {
              outputSeq: outputSeq.concat([
                [null, {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, { gallery: 'gallery', items: currentItems, photo: currentPhoto })
                }]
              ]),
              state: { pendingQuery: '', currentItems, currentPhoto }
            };
          case 'SELECT_PHOTO':
            return {
              outputSeq: outputSeq.concat([
                [null, {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, { gallery: 'photo', items: currentItems, photo: eventData })
                }]
              ]),
              state: { pendingQuery: '', currentItems, currentPhoto: eventData }
            };
          case 'EXIT_PHOTO' :
            return {
              outputSeq: outputSeq.concat([
                [null, {
                  command: COMMAND_RENDER,
                  params: assign({}, defaultProps, { gallery: 'gallery', items: currentItems, photo: currentPhoto })
                }]
              ]),
              state: { pendingQuery: '', currentItems, currentPhoto }
            };
          default :
            throw `unknow event??`
        }

      }, { outputSeq: [], state: { pendingQuery: '', currentItems: [], currentPhoto: undefined } })
    })
    .map(x => x.outputSeq);

```

Note that we do have to write by hand the computation of the expected outputs. We need a 
generic computation if we are to run hundreds of tests (we won't write or check by hand hundreds of 
fixtures). We call this process semi-automatic (or semi-manual): expected outputs are generated by
 an automatized procedure, but we have to write that procedure by hand.

### Comparison
To enable comparison between actual and expected output, we have to massage somewhat the shape of
 the data. For instance, objects containing functions cannot be directly compared, so we 
 preprocess the result to make them comparable.

### Results
We generated 27 tests which all pass (well, eventually).

## Testing the component
The test for the component are conceptually mostly the same than for the state machine, with the 
addition that the scope of the system under test is larger : it includes the rest of the 
component's modules. It ensues from this, that provided we have already tested satisfactorily 
against the state machine, we can afford to enact only those tests which are useful for 
testing the rest of the modules. This means at least tests which should exercise all the events 
accepted by the component, and produce all the commands handled by the command handlers. This 
means in general that a *All-transitions-coverage* criteria would be sufficient, when there is 
no complex logic lying in event preprocessor and command handler.

Note that the component testing should additionally include, when they are present, any aspect of 
its specifications not covered by the state machine (for instance covered by the preprocessor). 
This can for instance be, in a user interface, field entry persistance, which is handled by the 
browser. Those nice words said, in our example, we simply don't bother.

Testing the component involves :
- inserting in the component's view data attributes (`data-testid`) whose only aim is to point at
 DOM elements used in the testing process (that should be exactly those who are involved in the 
 specification of the behavior of the component) 
- mocking effects
- mapping test machine's input sequence to component's test event sequence (click, submit, etc.)
- For each event, determine the timing when to execute the test assertion and execute the test assertion

### Test attributes
Test attributes give a more robust testing experience, by further decoupling the testing process 
from implementation details (like css selectors). For more information on the technique, please 
refer to the 
[`react-testing-library`](https://github.com/kentcdodds/react-testing-library) repertory.

We could go a step further in the decoupling by replacing ids with details from the 
specifications (i.e. the DOM element with attribute `data-testid` set to `CANCEL` is the button 
with the text `CANCEL`), but we chose to remain at the `data-attribute` level for our example, 
so that we only use one technique for simplicity.

### Mocking effects
Effect modules are injected into the `<Machine />` component through the `effectHandlers` prop. 
That prop is provided to command handlers, which can use it to perform effects. At testing time, 
the prop can be substituted for mocked effect handlers. 

This gives flexibility to the leaking of testing concerns into the implementation. For instance, 
in our example, our flickr command handler basically consists in making an API request on a 
flickr endpoint. We could have mocked the request execution (say `fetchJsonp`), i.e. operating at a
 es6 module level. Instead, we are mocking `runSearchQuery` which takes a query and returns 
 results already formatted, i.e. operating at the domain level. 

In our image gallery example, it goes like this : 

```javascript
export const imageGallerySwitchMap = {
(...)
  effectHandlers: { runSearchQuery },
  commandHandlers: {
    [COMMAND_SEARCH]: (obs, effectHandlers) => {
      const { runSearchQuery } = effectHandlers;

      return obs.pipe(switchMap(({ trigger, params }) => {
        const query = params;
        return runSearchQuery(query)
          .then(data => {
            trigger("SEARCH_SUCCESS")(data.items);
          })
          .catch(error => {
            trigger("SEARCH_FAILURE")(void 0);
          });
      }));
    }
  },
(...)
}

const mocks = {
  runSearchQuery: function getMockedSearchQuery(inputSequence) {
    const FIRST_SEARCH = "cathether";
    const SECOND_SEARCH = "cat";
    const [s1Failures, s2Failures] = inputSequence.reduce((acc, input) => {
      let [s1Failures, s2Failures, lastSearch] = acc;
      const eventName = Object.keys(input)[0];
      const eventData = input[eventName];

      if (eventName === "SEARCH") {
        lastSearch = eventData;
      }
      if (eventName === "SEARCH_FAILURE") {
        lastSearch === FIRST_SEARCH ? s1Failures++ : s2Failures++;
      }

      return [s1Failures, s2Failures, lastSearch];
    }, [0, 0, null]);
    let s1 = s1Failures, s2 = s2Failures;

    // The way the input sequence is constructed, any search who fails would fails first before succeeding. So we
    // know implicitly when the failure occurs : at the beginning. I guess we got lucky. That simplifies the mocking.

    return function mockedSearchQuery(query) {
      // NOTE : this is coupled to the input event in `test-generation.js`. Those values are later a part of the
      // API call response
      return new Promise((resolve, reject) => {
        if (query === FIRST_SEARCH) {
          s1--;
          s1 >= 0
            ? setTimeout(() => reject(void 0), 2)
            : setTimeout(() => resolve({
              items: [
                {
                  link: "https://www.flickr.com/photos/155010203@N06/31741086078/",
                  media: { m: "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/159915559@N02/30547921577/",
                  media: { m: "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/155010203@N06/44160499005/",
                  media: { m: "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/139230693@N02/28991566557/",
                  media: { m: "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg" }
                }
              ]
            }), 2);
        }
        else if (query === SECOND_SEARCH) {
          s2--;
          s2 >= 0
            ? setTimeout(() => reject(void 0), 2)
            : setTimeout(() => resolve({
              items: [
                {
                  link: "https://www.flickr.com/photos/155010203@N06/31741086079/",
                  media: { m: "https://farm5.staticflickr.com/4818/45983626382_b3b758282f_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/159915559@N02/30547921579/",
                  media: { m: "https://farm5.staticflickr.com/4842/31094302557_25a9fcbe3d_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/155010203@N06/44160499009/",
                  media: { m: "https://farm5.staticflickr.com/4818/31094358517_55544cfcc6_m.jpg" }
                },
                {
                  link: "https://www.flickr.com/photos/139230693@N02/28991566559/",
                  media: { m: "https://farm5.staticflickr.com/4808/45121437725_3d5c8249d7_m.jpg" }
                }
              ]
            }), 2);
        }
        else {
          reject(new Error(`no mock defined for the query ${query}`));
        }
      });
    };

  }
};
```

### From test input sequence to events
The state machine test input sequences can be reused for testing the whole component. However, 
those input must be converted to events for the component. For instance, a `{SEARCH : query}` input 
must be mapped to the sequence of events : `[fill the DOM element with selector [data-testid=...] 
with query, click the DOM element with selector [data-testid=...]]`. Those events must then be 
simulated. Once a set of events have been simulated, it is often necessary for the effects of the 
events to be apparent, at what time the test assertions can proceed (cf. next section). For 
instance, update of the screen by React are often asynchronous. It will hence not always be possible
 to observe the new screen on the same tick as passing the submit event.

We chose `react-testing-library`, among other reasons, for the ease by which it is possible to 
specify waiting conditions for assertions to be executed. 

The mapping event(s) to input(s) may be a n-to-n mapping, which may then complicate writing the 
event sequence. Generally speaking, the more characteristics of the preprocessor are used (stream 
 combinators, schedulers, etc.), the more complex it will be to simulate events on the user end. 
 For instance, assuming a drag-and-drop event did not exist and would be handled by the 
 preprocessor, that drag-and-drop event would have to be carefully recreated through a timely 
 sequence of primary events (click, move while clicking, etc.). In general however, most of the 
 mappings will be simple simple 1-to-1 mappings. That is the case for our image gallery example.
 
 Here are some examples of 1-to-1 mappings (`onSubmit` -> `SEARCH`):
 
```javascript
   preprocessor: rawEventSource => rawEventSource.pipe(
     map(ev => {
       const { rawEventName, rawEventData: e, ref } = destructureEvent(ev);
 
       if (rawEventName === INIT_EVENT) {
         return { [INIT_EVENT]: void 0 };
       }
       // Form raw events
       else if (rawEventName === "onSubmit") {
         e.persist();
         e.preventDefault();
         return { SEARCH: ref.current.value };
       }
       else if (rawEventName === "onCancelClick") {
         return { CANCEL_SEARCH: void 0 };
       }
       (...)

``` 

Here is how events are simulated in our image gallery example :

```javascript
// Test config
const when = {
  [INIT_EVENT]: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;

    render(component, { container: anchor });
    return waitForElement(() => true);
  },
  SEARCH: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    const query = eventData;

    fireEvent.change(getByTestId(container, SEARCH_INPUT), { target: { value: query } });
    fireEvent.submit(getByTestId(container, SEARCH));
  },
  SEARCH_SUCCESS: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;

    // NOTE: System events are sent by mocked effect handlers (here the API call). On receiving the search response, the
    // rendering happens asynchronously, so we need to wait a little to get the updated DOM. It is also possible
    // that the DOM is not updated (because the new DOM is exactly as the old DOM...). The less error-prone way is
    // to just wait `n > 1` tick (that should be enough for React to render) and to read the DOM then. No events
    // will be received during those `n` ticks to be sure that React had the time to update the DOM.
    // Those time-dependencies are tricky in theory. However, in practice most of the time, heuristics like the one
    // we just described suffice.
    // Note that because we anyways chain assertions with promises, we naturally wait a tick between assertions, so
    // we could have done away with the `waitForElement`. For clarity purposes, we however let it be visible.
    return waitForElement(() => getByTestId(container, PHOTO))
    // !! very important for the edge case when the search success is the last to execute.
    // Because of react async rendering, the DOM is not updated yet, that or some other reason anyways
    // Maybe the problem is when the SECOND search success arrives, there already are elements with testid photo, so
    // the wait does not happen, so to actually wait I need to explicitly wait... maybe
      .then(()=> wait(() => true));
  },
  SEARCH_FAILURE: (testHarness, testCase, component, anchor) => {
    return waitForElement(() => getByTestId(container, SEARCH_ERROR));
  },
  SELECT_PHOTO: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    const item = eventData;
    // find the img to click
    const photos= getAllByTestId(container, PHOTO);
    const photoToClick = photos.find(photoEl =>  photoEl.src === item.media.m);

    fireEvent.click(photoToClick);
    // Wait a tick defensively. Not strictly necessary as, by implementation of test harness, expectations are delayed
    return waitForElement(() => getByTestId(container, PHOTO_DETAIL));
  },
  EXIT_PHOTO: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    const photoToClick= getByTestId(container, PHOTO_DETAIL);
    fireEvent.click(photoToClick);

    // Wait a tick defensively. Not strictly necessary as, by implementation of test harness, expectations are delayed
    return waitForElement(() => true);
  },
  CANCEL_SEARCH: (testHarness, testCase, component, anchor) => {
    const { assert, rtl } = testHarness;
    const { eventData, expectedOutput, mockedEffectHandlers } = testCase;
    const { render, fireEvent, waitForElement, getByTestId, queryByTestId, wait, within, getByLabelText } = rtl;
    fireEvent.click(getByTestId(container, CANCEL_SEARCH));

    return wait(() => !queryByTestId(container, CANCEL_SEARCH));
  },
};

```

One can observe how a  `SEARCH` input in a test machine input sequence is mapped to filling an 
input (`change` event) and then submitting the form (`submit` event). One can also observe the 
waiting conditions appearing most of the time. For instance, a `CANCEL_SEARCH` input is mapped to
 click on the cancel button, and then we wait till the button disappears from the screen to 
 perform our assertion (cf. `react-testing-library` for details about the `wait` semantics).

### Test assertion 
Once the appropriate waiting conditions have been fulfilled, assertions are run corresponding to 
the expected outcome of the simulated event. To know which assertion to run, the fsm is used as 
oracle. Output test sequences resulting from running the fsm's input test sequences are turned 
into assertions. For instance, we said previously that a `SUBMIT` event may be mapped to a `SEARCH` 
input to the fsm. That `SEARCH` input passed to fsm results in two commands : the API call and 
the rendering of the loading screen. Those two commands correspond to two assertions. The API 
call will be matched to an assertion on the mocked `runSearchQuery` effect. The render will be 
matched to an assertion on the inner html of the anchoring DOM element for the component.

For the image gallery specs, that gives :

```javascript
const then = {
  [COMMAND_RENDER]: (testHarness, testCase, component, anchor, output) => {
    const { command, params } = output;
    const { assert, rtl } = testHarness;
    const { eventName, eventData, mockedEffectHandlers } = testCase;
    const actualOutput = normalizeHTML(anchor.innerHTML);
    const expectedOutput = normalizeHTML(params);
    assert.deepEqual(actualOutput, expectedOutput, `Correct render when : ${prettyFormat({ [eventName]: eventData })}`);
  },
  [COMMAND_SEARCH]: (testHarness, testCase, component, anchor, output) => {
    const { assert, rtl } = testHarness;
    const { eventName, eventData, mockedEffectHandlers } = testCase;
    const query = eventData;

    assert.ok(mockedEffectHandlers.runSearchQuery.calledWithExactly(query), `Search query '${query}' made when : ${prettyFormat({ [eventName]: eventData })}`);
  }
};
```

Note as we normalize (`normalizeHTML`)the inner HTML from our actual and expected screen in order to
 be able to compare them. Concretely, we remove the `data-testid` from the html, so our test do not
 depend on the presence or absence of such attributes. We also list a html tag properties in a 
 predetermined order, and add a semi colon to all `style` properties. While this is not perfect 
 (ascii characters could also be normalized to unicode for applications supporting exotic 
 languages, etc.). This is however found to eliminate most of the cases of discrepancy, where the 
 HTML strings differ, but the semantics of both HTML strigns are exactly the same. It might sound 
 strange and brittle to test against HTML, and one might come to miss the snapshot feature of `jest`. 
  However, remember that the expected HTML was generated already for us when we ran the test cases 
  for the state machine. We then never had to manually copy and paste HTML strings from anywhere, 
  which would be a deal-breaker, considering we run hundreds of tests for a single fsm.


## Additional considerations
- we chose to perform our tests completely in the browser
  - this gives more confidence as this is what an actual user will be using
  - the debugging experience is much better (all chrome debugger tools are available, faster 
  than node-debug, and the component is displayed on the screen which allows to visually detect 
  defaults)
  - test execution remains fast : we were able to run our 27 tests with 300+ assertions under 3 
  seconds on a machine with average specifications. 
  - the `react-testing-library` testing library used works very similarly to `testcafe`, a 
  terrific end-to-end testing library, possibly making it easier to promote some unit tests to 
  end-to-end tests 
- If there are have properties/invariants in the component specifications, property-based testing
 can be put to good use. 
- you could also skip the semi-automatic validation of the state machine and directly use the 
generated input sequences to test against the component. That seems very attractive because that
 is less apparent work. However :
  - it is not much less work : the input sequence can only be generated automatically for the 
  state machine, not the component, so the translation input -> event is inevitable; the output 
  sequence, whether mocked effects, or  commands, have to semi-automatically computed anyways. In
   the end, the effort that is saved is the conversion from expected machine outputs to 
   assertion on the `<Machine/>` component.
  - if a component test fails, you then will have to decide whether it was the state 
  machine which was wrongly specified or the other modules (preprocessor, command handler, effect
   handler) which are failing. You may quickly loose the productivity saving due to that 
   uncertainty and the related investigation time
- we use QUnit and `react-testing-library`. However, because we used no special or esoteric 
feature of our testing framework, it is easy to use any framework of our choice, and suitable 
replacement for the browser. The reverse would not be true : relying on jest mocking and 
snapshotting features means being married to jest.

# Prior art and useful references
- [User interfaces as reactive systems](https://brucou.github.io/posts/user-interfaces-as-reactive-systems/)
- [React automata](https://github.com/MicheleBertoli/react-automata)
- [react-xstate-js](https://github.com/bradwoods/react-xstate-js)
