- [Motivation](#motivation)
- [Modelling user interfaces with state machines](#modelling-user-interfaces-with-state-machines)
- [Installation](#installation)
- [API design goals](#api-design-goals)
- [API](#api)
    + [Description](#description)
    + [Example](#example)
    + [Types](#types)
    + [Contracts](#contracts)
    + [Semantics](#semantics)
- [Tips and gotchas](#tips-and-gotchas)
- [Further examples](#further-examples)
- [Testing](#testing)
  * [Testing the state machine](#testing-the-state-machine)
  * [Testing the component](#testing-the-component)
  * [Example](#example-1)
    + [Testing the machine](#testing-the-machine)
    + [Testing the component](#testing-the-component-1)
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
    commandHandlers: {
      [COMMAND_SEARCH]: obs => {
         return obs.switchMap(({trigger, params}) => {
           const query = params;
           return runSearchQuery(query)
             .then(data => {
               trigger('SEARCH_SUCCESS')(data.items)
             })
             .catch(error => {
               trigger('SEARCH_FAILURE')(void 0)
             });
         })
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

Note that we use here the two mentioned React lifecycle hooks, as we are using the [`Flipping`]
(https://github.com/davidkpiano/flipping) animation library. This library exposes a `flip` API 
which must be used immediately before render (`flipping.read()`), and immediately after render 
(`flipping.flip()`). 

This is it! Whatever the machine passed as parameter to the `Machine` component, its behaviour 
will always be as described.

### Types
Types contracts can be found in the [repository](https://github.com/brucou/react-state-driven/tree/master/types). 

Let's just say here that adapting an event processing library is the most complicated to 
interface. This is already done for Rxjs and you can just import the adapter and use it. 
Concretely, the interface involves:
- `create`, `merge` functions, which respectively create and merge observables
-  `subjectFactory` which creates a subject, which implements the observable and observer interface 
- has the following operators available : `filter`, `map`, `flatMap`, `shareReplay`, which can be
 used by means of a `pipe` method on the observable prototype
- emission of observables can only be started on `subscribe` (i.e. interfacing an event library 
like `xstream` is not advised)

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
- All command handlers are passed the raw event source emitter, so they can send back events
  - Render commands leads to definition of React components with event handlers. Those event 
  handlers can pass their raw events to the machine thanks to the raw event source emitter
  - Non-render commands leads to the execution of procedures which may be successful or fail. The
   command handler can pass back information to the machine thanks to the raw event source 
   emitter. There are two ways to specify a non-render command :
     - through a regular procedure taking two parameters (the raw event emitter and the command 
     params)
     - through a function receiving the stream of commands that it handles, as in our example. 
     Note that this function will only receive in that stream the commands it handles, i.e. a 
     `SEARCH` handler will receive a stream of `SEARCH` commands.
- The event source is created with the subject factory passed as parameters. That subject must 
have the `next, complete, error` properties defined (`Observer` interface), the properties 
`subscribe` defined (`Observable` interface), and at least five operators (`map`, `filter`, `flatMap`, 
`startWith`, `shareReplay`). Rx from `Rxjs` is a natural choice, but other reactive libraries can be 
easily adapted, including standard simple event emitters or callbacks.
- The event source is terminated when the `<Machine/>` component is removed from the screen 
(`componentWillUnmount` lifecycle method)

# Tips and gotchas
- If the configured state machine library has an initial event, it can be passed using a behavior
 subject (subject with an initial value). In that case, the `preprocessor` must be configured to 
 handle that initial event. Cf. examples
- The distinction between command handler types is made on the number of arguments passed to the 
command handler.
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
 recreate a double click for the `Search` button, we would have to receive two clicks before 
 passing a 
 `SEARCH` input to the machine. We use `Rxjs` to deal with those cases, as its combinator library
  (`map`, `filter`, `takeUntil` etc.) allow to aggregate events in a fairly simple manner. Note 
  that we could implement this logic in the state machine itself (our machines are 
  turing-machine-equivalent, they can implement any effect-less computation), but : 1. it is much 
  better to keep the machine dealing with inputs at a higher level of abstraction, 2. that kind 
  of event aggregation is **much easier** done with a dedicated library such as `rxjs` 
- Likewise, do not hesitate when possible to handle concurrency issues with the event processing 
library. In our example, we used `switchMap` which only emits the response from the latest 
request. Doing this in the machine, while possible, would needlessly complicate the design, and 
lower the level of abstraction at which the machine operates
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
All demos from examples can be found in the [demo repository](https://github.com/brucou/react-app-simple) :
- hello world
- controlled form
- uncontrolled form with ref
- image search app


# Testing a machine
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
 right events are passed to the pre-processor. Because the mediator comes already tested, and is
  the one doing the integration between the individual `<Machine />` units, there is no need to 
  further test the integration between units : the mediator is the one doing that integration 
  and it comes already tested. On the flip side, white-box testing involves what are 
  implementation details. A change in implementation with unchanged specifications is likely to 
  lead to rewriting some of the tests. Additionally, our white-box hypothesis might be incorrect 
  (`<Machine />` mediator buggy, preprocessor correctly written to the wrong specifications etc.)
  . This means the confidence in this method is the lower bound of the confidence in our hypothesis.

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

We will showcase here the black-box testing approach, which consists of two consecutive steps : 
testing the state machine, and testing the component. 

## Testing the state machine
The state machine encodes the behaviour of the component. It results from this that a change in 
the implementation of the component, with no changes in semantics, will not change the state 
machine modelization, hence the tests related to that machine. In particular, even when the 
component would implement its behaviour without ever referring to the modelling machine, the 
tests generated by the model would still be useful to test the behaviour of the system. 

Testing the machine is testing a causal function. The corresponding testing procedure is thus 
simple : generate input sequences, and validate output sequences. A test scenario is thus a couple 
made of an input sequence and the expected output sequence. The test space for such test scenari is 
naturally infinite, and example-based testing techniques can thus never exhaustively cover the 
test space. Several partial coverage criteria have been defined and can be adopted. Using what is 
known about the system at hand can also help uncover the valuable section of the test space to 
put under test. 

The [react-state-driven library](https://github.com/brucou/react-state-driven) offers a test 
generator which can be configured according to several model coverage criteria. Such or similar 
test generators may simplify further the testing procedure. 

Last but not least, the techniques we have been mentioning are generic and apply to any state 
machine model. It is also a good idea, if we have properties/invariants in our specifications, to use 
property-based testing to check on those. 

As a conclusion, because of the large test space inherent to user interfaces, the idea is to 
automate as much as possible the testing, whether through example-based or property-based testing.

## Testing the component
The test for the component are conceptually mostly the same than for the state machine, with the 
addition that the scope of the system under test is larger : it includes the rest of the 
component's modules. It ensues from this, that provided we have already tested satisfactorily 
against the state machine, we can afford to enact only those tests which are useful for 
testing the rest of the modules. This means tests which should exercise all the events accepted 
by the component, and produce all the commands handled by the command handlers. This means in 
general that a *All-transitions-coverage* criteria would be sufficient, when there is no complex 
logic lying in event preprocessor and command handler.

Note that the component testing should include, when they are present, any aspect of its 
specifications not covered by the state machine. This can for instance be, in a user interface, 
field entry persistance, which is handled by the browser.

## Example
We will reuse here the image gallery search application we previously introduced.

### Testing the machine
Testing the machine involves :
- generating test scenarios
- compute for each scenario the expected output
- compute the actual output from the test scenarios
- compare actual output vs. expected output

#### Scenario generation
Because we have a relatively small state machine, we decide to adopt a `All-2-transitions` model 
coverage criteria. Concretely we are interested in the paths through the machine for which no 
edges are repeated more than twice, and the path ends in the `gallery` control state.

To simulate credible use of the interface by the user, we need to generate user and systems 
events (i.e. inputs to the machine) which depends on the previous such events. This looks just 
like a state machine! What we need here, is, for each control state that the tested machine is in
 (after running a sequence of inputs), be able to produce another input which will progress the 
 machine on a given transition. If that is not possible, the test generation naturally cannot 
 progress further. With our test generation, we specify the inputs to be generated in each 
 control state, for each transition, in a data structure which copies the machine under test. The
  input generator receives the extended state of the machine under test, together with the state 
  of the input generation, and must return :
  - whether the current input sequence can be extended
  - if extension is possible, an input to be concatenated to the previous inputs
  - the corresponding update of the state of the input generation

In our case, we keep track of the queries performed and pending, so that we can simulate more 
closely the behaviour of the back-end system. For instance, if two queries are sent to the 
back-end, an incoming response may correspond to either two. We also try not to repeat the same 
search twice, except if the search failed.

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

#### Expected output
In the expected output sequence, we will have all the commands to be realized on the interfaced 
systems. 

This includes render commands as a special case. Render commands will return a function 
which eventually compute a react element to be rendered. We **DO NOT test the react component** at 
this level. We simply test against the `props` of that components as they describe entirely the 
visual appearance of that component (i.e. the component only depends on `props` for its render 
concern). This makes for a very straight forward testing.

Note that the React component still have to be tested, but that can be done separately, by any of
 the usual React specific testing technique ([storybook](https://storybook.js.org/) is a nice way to do that, when it is 
 possible). We have an architecture made of decoupled parts, and we can test each part separately
  **with the best tool available to that purpose**.

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

#### Comparison
To enable comparison between actual and expected output, we have to massage somewhat the shape of
 the data. For instance, objects containing functions cannot be directly compared, so we 
 preprocess the result to make them comparable.

#### Results
We generated 27 tests which all pass (eventually).

### Testing the component
TODO : the image search gallery

# Prior art and useful references
- [User interfaces as reactive systems](https://brucou.github.io/posts/user-interfaces-as-reactive-systems/)
- [React automata](https://github.com/MicheleBertoli/react-automata)
- [react-xstate-js](https://github.com/bradwoods/react-xstate-js)
