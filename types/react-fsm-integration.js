// Commands
/**
 * @typedef {NO_OUTPUT} NoCommand
 */
/**
 * @typedef {String} CommandName
 */
/**
 * @typedef {RenderCommand | SystemCommand} Command
 */
/**
 * @typedef {{command : COMMAND_RENDER, params : (function (trigger:RawEventDispatcher):React.Component)  }}
 *   RenderCommand
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
 * @property {EventHandler} eventHandler Interface for event processing. Libraries such as Rxjs can be adapted to
 * that interface.
 * The factory is called with `new`. The returned object must have all methods in `Combinators`
 */
/**
 * @typedef {function (RawEventSource) : MachineEventSource} EventPreprocessor
 */
/**
 * @typedef {Object} EventHandler
 * @property {function(): Subject} subjectFactory Returns a subject which implements the observer (`next`, `error`,
 * `complete`) and observable (`subscribe`) interface.
 * @property {function(Producer): Observable} create Creates an observable from a producer function
 * @property {function(...): Observable} merge Returns an observable which merges the observables passed as parameter
 */
/**
 * @typedef {function(Observer) :()} Producer A producer produces and sends value to an observer
 */
/**
 * @typedef {Observable} MachineEventSource
 */
/**
 * @typedef {Subject} RawEventSource
 */
/**
 * @typedef {BasicCommandHandler | AdvancedCommandHandler} CommandHandler
 */
/**
 * @typedef {function(RawEventDispatcher, params : *): *} BasicCommandHandler This command handler shape allows to
 * directly handle the command, independently of the interfaced event processing library
 */
/**
 * @typedef {function(Observable): Observable} AdvancedCommandHandler This command handler shapes interfaces with
 * the event library to process the command. This is useful when the event processing library has some
 * aggregation, error or concurrency management that we want to reuse
 */
/**
 * @typedef {function(RawEventName):RawEventCallback} RawEventDispatcher
 */
/**
 * @typedef {function(RawEventData, React.ElementRef, ...):*} RawEventCallback
 */
/**
 * @typedef {String} RawEventName
 */
/**
 * @typedef {*} RawEventData
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
