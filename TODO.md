- change build: pkg does not publish anymore, reinstall nd rety
  - does not work with codesndbox playground (CORS error having nothing to do with CORS)
  - if it does not work, reverse to a rollup build...
- change API:
  - have renderWith
  - have props + isVisible[=false] as state of <Machine> components
  - toggle isVisible on the first render
  - when COMMAND_RENDER, merge the params in the props property
  - rerender renderWith with the new merged props
  - NOTE: can already be done with 
  [COMMAND_RENDER]: (machineComponent, renderWith, params, next) => {
        // Applying flipping animations : read DOM before render, and flip after render
        flipping.read();
        const newProps = merge(machineComponent.props, params); // merge be optional user defined
         props of <Machine>
        machineComponent.setState(
          { 
            render: React.createElement(renderWith, Object.assign({}, newProps, { next }), []),
            props: newProps 
          },
          () => flipping.flip()
        );
      }
// TODO : test actions are run in order..
- EXAMPLE OF SUBSTITUTION : 
  - > any state machine implementation can be substituted to our library provided that it respects 
      the machine interface and contracts: 
  - give an example of state machine written as a standard function - no library
    - the password example is great for that
- NTH: options: event emitter property name (next by default) - so interface with renderWith can 
be customized!
- DOC!! procss all the DOC it notes in the code
- incorporate in codesandbox AND demoboard link for article then PUBLISH the motherfucking article
  - idea is stat machine will be the same among all ui libraries
- try with initial control state and new version of state transducer
- UPDATE README! clean code. new article will send lots of people
- when finished, update state transducer to remove the event handler library of options! cf code 
TODOs
  - actually might even have meta data in observe and subject interface (give it a name for 
  tracing?)
  - if no eventHandler passed, then use internal event handling library which is just 
  eventEmitter and listeners. Then leave transducers out
  - make preprocessor an object :
    - {rawEvent : (rawEventData, ref) => ...}
  - if not a function then use the object format
- do a test generation library also for testing the FSM cd. movie-search-app, for now I only 
generate the inputs
- then do a library also for running the tests in DOM real browser 
- include this as observable library in connection with the event emitter : 4 Kb all included!!! 
and that means all operators which can be tree shaken -- and performant!!
- have a rollup config for min and one without, and add source map
- write same movie search app for hyperHTML, svelte and angular!
- change API to have observable, observer, and pipe API for event handler!!
  - change subject API to next instead of `emit`, this is observable standard
- update demo code
- make a esm version of penpal to decrease size (right now I import the whole thing...)
- in demos, add options with initial event [INIT_EVENT, 0] cf. ipage_gallery_component_spcs
- update README with nice drawing 
  - event seq. => input seq. => fsm => output seq. => assertion seq.
  - graphs about controller vs. mediator
  - mocks, category computation <- machine some graph to explain that the command handler effect 
  handler -> add to the LSC graph!! 
- look at that plan-oriented-testing (recoup with the improvement in the testing generation)
- explain the resulting architecture
  - communicate outputs by callback : similar to onClick for instance
  - how to receive inputs?? pass an event source as parameter!!
  - this architecture allow to implement any effectful component!! communicating through in and 
  out sources
  - can those components be synchronized via a monitor?? to investigate but the idea would be to 
  copy Erlang here. If I want to implement a restart/stop for instance, then I should have a 
  protocol that gives components the possibility to clean up, and also a way to restart (that 
  should be restarting the machine right?) The point is this is independent from the chart. The 
  monitor would also manage error (using react boundaries, or having an error callback on each 
  component?)
  - I could use a monitor which implement an actor-based protocol, with actors being React 
  component based on state machines!!
    - implement nice examples 
- could add a machine.stop in the interface, that we would run in the onComplete, or on 
    ErrorHandler (no need for xstate integration but maybe for others)
- add debugging support..., an overlay tipicamente would be good 


# Actor model
## Basics
- a machine has a receiving source which receives :
  - next messages : message to be processed
  - exit messages : from linked/dependent machines
- a machine has a emitting source which emits :
  - next messages
  - exit message with reason
- addressing to think about
- a machine can create other machines and pass them a receiving source and an exit source
  - the receiving source receives events delegated by/from the parent machine
  - the receiving source receives events delegated by the parent machine
  - the exit source can be connected back to the machine
  - or to other machine's source that the parent machine know of??

## Links
- a parent machine can create another machine and pass sources so that:
  - the child machine receives next message
  - error messages received from the child machine triggers a forwarding of the error to its exit
   source
   - conversely, an exit message from the parent machine is propagated to its children
   - the exit message forwarded are of the same nature : if normal, then normal, if other 
   reasons then that
- this means links are bidirectional 

> Terminating processes will emit exit signals to all linked processes, which may terminate as 
well or handle the exit in some way.
> The default behaviour when a process receives an exit signal with an exit reason other than normal, is to terminate and in turn emit exit signals with the same exit reason to its linked processes. 
An exit signal with reason normal is ignored.

## Monitor
- same as links, BUT :
  - an exception (i.e. not normal exit) is turned into receiving a down message

## Supervisors
- list children
- 4 strategies, did not understand the last one
- supervisor is about restarting!

> The supervisor is responsible for starting, stopping, and monitoring its child processes. The basic idea of a supervisor is that it must keep its child processes alive by restarting them when necessary.


# State machine debugger
## Goals
Memorize the trace of execution of a state machine and propose a navigation interface allowing to
 rewind and forward past events to see their effects on the machine. Desirable features are a 
 clipboard and diff functionality, for instance compare two events and look at the diff.
## UX/UI
- drawer, overlay, sidebar... Basically show and hide on demand, is seen over given content
- could be transparent when far, opaque when close (mouse)
- activable/deactivable
- 

-------->
data display | vertical ev -> eff | zoom machine viz | data display (extended state)
(ev|pre|output|eff)

prev/next, fast prev/fast next, counter with index x/y

## Features
- live connection to the `<Machine/>` component
- keeps trace of events, to the machine, outputs to the machine, and extended state
- probably should also keep track of preprocessor input?, and also effect handlers call, and 
trigger call
- should/could render COMMAND_RENDER (or not? just html?) 
- visualize state machine and color active state and previous transition
- should keep track of expected output sequence too
- allow memorization of stuff, and diff between any two of those
  - grouped by type? diff events? diff command? etc.
- should display a navigator
  - one step could be broken down as 
      - event
      - input
      - command
      - effect
  - navigation between steps, and within steps

## API design
- event source
- event emitter (callback)

# Choice of window manager
- [subdivide](https://github.com/philholden/subdivide)
  - 3 years not updated, not maintained, 3 contributors
  - you have to have a list of applications before hand to pick the window
  - nice videos - have a look
  - nice idea though, user-driven layout, the top in customizability
  - may be useful for language learning system

# Choice of window tech
- [same-domain window](https://github.com/ryanseddon/react-frame-component)
  - easiest
  - BUT requires me to ship the debug window code with react-state-driven and can't be tree-shaken
    - so potentially turning it from 8K gzip to ?? gzip?
  - doing this with injecting debug app as prop won't work
  - how to use the same css style?? can use style prop
  - cf. also https://medium.com/@ryanseddon/rendering-to-iframes-in-react-d1cb92274f86
  - license is weird, ask!!
- iframe and communicate via postMessage
  - [postmate](https://github.com/dollarshaveclub/postmate) looks amazing and low level and 
  easier API
  - [zoid](https://github.com/krakenjs/zoid) seems like a rich solution, but haven't understood it
   all yet. Seems to integrate pretty well with react
    - size??
    - understand [post-robot](https://github.com/krakenjs/post-robot) 
- copy styling in new window just after opening (no need to be ready)
  - [react new window](https://hackernoon.com/using-a-react-16-portal-to-do-something-cool-2a2d627b0202)
- postmate looks promising, 1.5KB vs. 10+/20+kb for post-robot/zoid
  - however no timeout management! or error management!    
- possibilities
  - [flex layout](https://github.com/caplin/FlexLayout)
    - API seems simple, documentation understandable(!)
    - 81 stars, 6 contributors
    - not too many demos, and not too beautiful
    - tabs can close and expand
    - some layout configuration are hard to do manually for the user (spanning two widgets) 
    - but unique and very nice system for border tab handles
      - so you have a center area, and four borders
  - [golden layout](https://github.com/golden-layout/golden-layout)
    - 4035 stars, 45 ccontributors
    - last updated 7 months ago, lots of issues unresolved (more like Q&A though)
      - so probably not very maintained
    - allows to pop out and back windows
    - does tabs, window controls, but no border handles
    - LOTS of examples!! and doc not too bad
  - [react mosaic](https://github.com/palantir/react-mosaic)
    - 1569 stars, 7 contributors
    - uses a binary tree (?) to describe the layout structure 
    - does not do tabs and border handles
    - demos but not too much in form of documentation
    - annoying typescript and tsx code with poor readability
  - [React-Grid-Layout](https://github.com/STRML/react-grid-layout)
    - 7571 stars, 47 contributors
    - used in top companies
    - only does layouting
    - no tabs/stacks...
    - slick and clean
    - maintained
    - issues dealt with
    - http://demo.thorpora.fr/ez-dashing/
    - https://camo.githubusercontent.com/8c68a2e6d6e01364247232267a5698ac0d9b63c6/687474703a2f2f692e696d6775722e636f6d2f6f6f314e5436632e676966
    - https://strml.github.io/react-grid-layout/examples/0-showcase.html

OK for now, it seems `flex layout` is what we need. This is the closest to webstorm window system
. React-Grid-Layout seems the most user friendly slick but it would be necessary to customize a 
lot to add features (tabs, border handles) in a slick way. 

# API subject + transducer
- try catch and error processing
- write adapter for event emitter
  - beware of error and completion semantics: should I close the subscription a la rxjs?? 
  to think about 
- in example, I will have to write flatMapLatest myself!
- DOCs!!
- will have to write concatMap also as transducer... mmm will be concatMapPromise

In order:
- make it work with Rx with the machine example without flatMapLatest
- add flatMapLatest
- make it work with event emitter
- do try catch error processing
