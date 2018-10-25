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
 * @typedef {{command : COMMAND_RENDER, params : (function (trigger:RawEventDispatcher):React.Component)  }} RenderCommand
 */
/**
 * @typedef {{command : CommandName, params : * }} SystemCommand
 */
// Mediator
/**
 * @typedef {Object} MachineProps
 * @property {EventPreprocessor} [preprocessor = x=>x]
 * @property {FSM_Def} fsmSpecs machine definition (typically events, states and transitions)
 * @property {{updateState : ExtendedStateReducer, ...}} settings Settings which will be passed to the state machine which
 * allows to customize its behaviour. At the minimum, it should include a state reducer by which the machine updates
 * its extended state.
 * @property {Object.<CommandName, CommandHandler>} commandHandlers
 * @property {Object.<ControlState, ActionFactory>} entryActions
 * @property {{Subject : SubjectFactory}} subjectFactory Subject factory. A subject is an entity which is both an
 * observer and an observable, i.e. it can both receive and emit data. A typical value for this parameter could be
 * Rx (from Rxjs).
 * The factory is called with `new`. The returned object must have all methods in `Combinators`
 */
/**
 * @typedef {function (RawEventSource) : MachineEventSource} EventPreprocessor
 */
/**
 * @typedef {Observable} MachineEventSource
 */
/**
 * @typedef {Subject} RawEventSource
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
