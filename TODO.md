cf. TODOs in README
// TODO : test actions are run in order...
- move to rxjs 6, i.e. functions pipe, map, filter etc out of prototype... 

- could change the interface of command handler to be a combinator
  - {SEARCH : Observable<{trigger,params}> -> Observable<*>}
  - obs => obs.flatMapLatest({trigger, params} => runSearchQuery(query).then(...).catch(...))
  - could also be a function obs({trigger, command, params}) => obs(*)
    - that would allow to combine different command in case they are not independent, but it is 
    probably better to keep commands independent. If they are not independent this means state 
    handled at the obs level, and more boilerplate at the obs level... better keep them 
    independent or allow both syntaxes
    - both syntaxes : command handler is either Observable -> Observable, or Object.<Command, Observable -> Observable> 
    - this uses the potential of event processing libraries at the same time, it avoids doing 
    lower-level stuff in the state machine so it can stay at a higher level of abstraction
    - that said this means this is stuff that goes undocumented in the state machine...
    - HOW TO TEST?? I have to test the preprocessor, the state machine, and the handler
      - should write a tester for observable, and try to have independent of the library and with
       marbles. That implies the observable output must be deterministic!!
        - if several concurrent queries should use forkJoin for instance 
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
- add it to https://github.com/GantMan/ReactStateMuseum : marketing
  - then do a sandbox with it from https://github.com/GantMan/ReactStateMuseum, cf. purestore
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
