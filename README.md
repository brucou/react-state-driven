# Motivation
User interfaces are reactive systems which can be modelized accurately by state machines. There 
is a number of state machine libraries in the field with varying design objectives. We have proposed
 an extended state machine library with a minimal API, architected around a single causal function, 
 which does not produce effects. This particular design requires integration with the interfaced 
 system, in order to produce the necessary effects (user events, system events, user actions). We
  present here an integration of our [proposed machine library](https://github.com/brucou/state-transducer) with `React`. 

This document is structured as follows :

- we quickly present the rationale behind modelling user interfaces with state machines
- TODO

# Modelling user interfaces with state machines
We are going all along to refer to a image search application example to illustrate our 
argumentation. Cf. [Example section](#example) for more details.

In a traditional architecture, a simple scenario would be expressed as follows :

![image search basic scenario](assets/Image%20search%20scenario.png)

What we can derive from that is that the application is interfacing with other systems : the user
 interface and what we call external systems. The application responsibility is to translate user
  actions on the user interface into actions on the external systems, execute those actions and 
  deal with their result.

In our proposed architecture, the same scenario would become :

![image search basic scenario](assets/Image%20search%20scenario%20with%20fsm.png)

In that architecture, the application is refactored into a mediator, a preprocessor and a state 
machine.

# API design goals
We want to have an integration which is generic enough to accomodate a large set of use cases, 
and specific enough to be able to take advantage as much as possible of the `React` ecosystem 
and API. In particular :

- it should be seamless to use both controlled and uncontrolled components
- it should be possible to use without risk of interference standard React features like `Context`

# API
##` <Machine intentSourceFactory, fsmSpecs, actionExecutorSpecs, entryActions, settings, componentDidUpdate, componentWillUpdate />`

### Description
We expose a `<Machine />` React component which will hold the state machine and implement its 
behaviour using React's API. The `Machine` component behaviour is specified by its props. Those 
props reflect : the specifications of the underlying machine, pre-processing of interfaced 
system's raw events, functions executing machine commands and performing effects on the 
interfaced systems. They also include settings for machine parameterization, and 
`componentDidUpdate` and `componentWillUpdate` props to integrate with the relevant React API. 
Our `Machine` component expects some props but does not expect children components. 

### Types
**TODO** That should explain the trigger and stuff. But first decide on terminology : command or 
action??

### Semantics
** TODO ** draw the architecture events -> intents -> machine -> commands -> effects
** TODO ** explain trigger in component
** TODO ** terminology raw events, machine input or machine events, intent, actions, commands. 
Some arguments might become rawEvent and eventData for the machine event might be inputData?? I 
think I should stick to input for machine. But then outputs are commands... but only for user 
interfaces. But then if use input for machine, do I still need raw events?

### Example
To showcase 
usage of our react component with our machine library, we will implement an [image search 
application](https://css-tricks.com/robust-react-user-interfaces-with-finite-state-machines/#article-header-id-5). 
That application basically takes an input from the user, looks up images related
 to that search input, and displays it. The user can then click on a particular image to see it 
 in more details. The corresponding machine is here :

![machine visualization](https://i.imgur.com/z4hn4Cv.png?1)

For illustration, the user interface starts like this :

![image search interface](https://i.imgur.com/mDQQTX8.png?1) 

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
    intentSourceFactory: rawEventSource => rawEventSource
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
    actionExecutorSpecs: {
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

const App = machine => React.createElement(Machine, {
  entryActions: machine.entryActions,
  intentSourceFactory: machine.intentSourceFactory,
  fsmSpecs: machine,
  actionExecutorSpecs: machine.actionExecutorSpecs,
  settings: {},
  componentWillUpdate : (machine.componentWillUpdate||noop)(machine.inject),
  componentDidUpdate: (machine.componentDidUpdate||noop)(machine.inject)
}, null);

ReactDOM.render(
  App(machines.imageGallery),
  document.getElementById('root')
);
```
 
Now let's explain a bit what is going on here. 

First of all, we use `React.createElement` but you 
could just as well use jsx `<Machine ... />`, that really is but an implementation detail. In our
 implementation we are mostly using core React API and [hyperscript](https://github.com/mlmorg/react-hyperscript) rather than jsx. Then keep in mind that when we write 'the 
 machine', we refer to the state machine whose graph has been given previously. When we want to 
 refer to the `Machine` component, we will always specifically precise that.
 
Our state machine is basically a function which takes an input and returns an output. The inputs 
received by the machine are meant to be mapped to events triggered by the user through the user 
interface. The outputs from the machine are commands representing what action/effect to perform 
on the interfaced system(s). Some commands always occur when transitioning to a given control 
state of the state machine : we gather those commands in `entryActions`. The mapping between 
user/system events and machine input is performed by `intentSourceFactory`. The commands output 
by the machine are mapped to executors gathered in `actionExecutorSpecs` so our `Machine` 
component knows how to run a command when it receives one. `componentWillUpdate` and 
`componentDidUpdate` are overriding default behaviour of the eponym lifecycle hooks for the 
`Machine` component. 

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
   API call, the action executor will trigger a `SEARCH_SUCCESS` or `SEARCH_FAILURE` event.
- The search is successful : the `SEARCH_SUCCESS` event is transformed into a machine 
input `{SEARCH_SUCCESS: items}`. 
  - The machine, per its specifications, updates its extended state `items` property, and outputs
   a render `GalleryApp` command. This displays the list of fetched items on the screen.
- Any further event will lead to the same sequence : 
  - the user or an interfaced system (network, etc.) triggers an event X,
  - that event will be transformed into a machine input (as per `intentSourceFactory`), 
  - the machine will, as per its specs, update its extended state and issue command(s) 
  - Issued command will be executed by the `Machine` component, as per `actionExecutorSpecs`

Note that we use here the two mentioned React lifecycle hooks, as we are using the [`Flipping`]
(https://github.com/davidkpiano/flipping) animation library. This library exposes a `flip` API 
which must be used immediately before render (`flipping.read()`), and immediately after render 
(`flipping.flip()`). 

This is it! Whatever the machine passed as parameter to the `Machine` component, its behaviour 
will always be as described.

# Tips and gotchas
- most of the time `intentSourceFactory` will just change the name of the event. You can 
perfectly if that makes sense, use `intentSourceFactory : x => x` and directly pass on the raw 
events to the machine as input. That is fine as long as the machine never has to perform an 
effect (this is one of the machine's contract). In our example, you will notice that we are doing
 `e.preventDefault`, so our example does not qualify for such a simplification of 
 `intentSourceFactory`. Furthermore, for documentation and design purpose, it makes sense to use 
 any input nomenclature which links to the domain rather than the user interface. As we have 
 seen, what is a click on a button is a search intent to the machine, and results in a search 
 command to the command executor. 
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
any relevent raw event should be associated to an event handler obtained through `trigger`. The 
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

**TODO : explain controlled component / uncontrolled component!!**
**TODO : do a code pen**
**TODO : command the code with explanation about trigger?**
