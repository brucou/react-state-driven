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
 * @property {FSM_Def} fsm machine definition (typically events, states and transitions)
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
 * @property {function(...):Pipeable} map same definition as the eponym operator from rxjs v6
 * @property {function(...):Pipeable} filter same definition as the eponym operator from rxjs v6
 * @property {function(...):Pipeable} flatMap same definition as the eponym operator from rxjs v6
 * @property {function(...):Pipeable} shareReplay same definition as the eponym operator from rxjs v6
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
 * @deprecated
 * @typedef {function(RawEventDispatcher, params : *): *} BasicCommandHandler This command handler shape allows to
 * directly handle the command, independently of the interfaced event processing library
 */
/**
 * @typedef {function(Observable, EffectHandlers): Observable} AdvancedCommandHandler This command handler shapes
 * interfaces with the event library to process the command. This is useful when the event processing library has some
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

/**
 * @typedef {Object} ReactMachineDef
 * @property {*} initialExtendedState
 * @property {FSM_States} states
 * @property {Array<EventLabel>} events
 * @property {EventHandler} eventHandler
 * @property {Preprocessor} preprocessor
 * @property {Array<Transition>} transitions
 * @property {EntryActions} entryActions
 * @property {CommandHandlers} commandHandlers
 * @property {EffectHandlers} effectHandlers
 * @property {function (this, prevProps, prevState, snapshot) : void} componentDidUpdate  Cf. React doc for
 * `componentDidUpdate`
 * @property {function (this, nextProps, nextState) : void} componentWillUpdate Cf. React doc for `componentWillUpdate`
 */
/**
 * @typedef {function (RawEventSource) : EventSource} Preprocessor
 */
/**
 * @typedef {Object.<ControlState, ActionFactory>} EntryActions
 */
/**
 * @typedef {Object.<CommandName, CommandHandler>} CommandHandlers
 */
/**
 * @typedef {Object.<EffectName, EffectHandler>} EffectHandlers
 */
/**
 * @typedef {function} EffectHandler
 */
/**
 * @typedef {String} EffectName
 */
/**
 * @typedef {function (FSM_Def, MockedEffectHandlers) : FSM} MockedMachineFactory creates the instance of a machine with
 * the given specifications, replacing its effect handlers by the given mocked effect handlers
 */
/**
 * @typedef {EffectHandlers} MockedEffectHandlers
 */
/**
 * @typedef {EffectHandler} MockedEffectHandler
 */
/**
 * @typedef {Object} TestScenario
 * @property {Array<TestCase>} testCases
 * @property {Mocks} mocks
 * @property {When} when
 * @property {Then} then
 * @property {Node} container
 * @property {MockedMachineFactory} mockedMachineFactory
 */
/**
 * @typedef {{inputSequence: InputSequence, outputSequence:OutputSequence, controlStateSequence:ControlStateSequence}} TestCase
 */
/**
 * @typedef {Array<LabelledEvent>} InputSequence
 */
/**
 * @typedef {Array<Array<MachineOutput>>} OutputSequence
 */
/**
 * @typedef {Array<ControlState>} ControlStateSequence
 */
/**
 * @typedef {Object.<EffectName, function (InputSequence) : MockedEffectHandler>} Mocks creates the instance of a machine with
 * the given specifications, replacing its effect handlers by the given mocked effect handlers
 */
/**
 * @typedef {Object.<LabelledEvent, function (TestHarness, TestCaseEnv, Component, Anchor) : Promise | *>} When for
 * each input of a machine under test, create or simulate the corresponding sequence of user interface events. May
 * return a promise allowing to wait for some conditions to be fulfilled before proceeding with the test (typically
 * waiting for the events to have a detectable effect)
 */
/**
 * @typedef {Node} Anchor Dom element where the React `<Machine/>` is rendered to
 */
/**
 * @typedef {{assert, rtl}} TestHarness `assert` is the assertion method for the test framenwork. `rtl` is the
 * injected dependency corresponding to the `react-testing-library` import
 */
/**
 * @typedef {Object} TestCaseEnv
 * @property {LabelledEvent} eventName
 * @property {*} eventData
 * @property {Array<MachineOutput>} expectedOutput
 * @property {InputSequence} inputSequence
 * @property {OutputSequence} expectedOutputSequence
 * @property {MockedEffectHandlers} mockedEffectHandlers
 * @property {When} when
 * @property {Then} then
 * @property {Mocks} mocks
 */
/**
 * @typedef {Object.<CommandName, function (TestHarness, TestCaseEnv, Component, Anchor, Array<MachineOutput>) : Promise | *>} Then
 * Runs an assertion, possibly returning a promise indicating the end of the assertion. The assertion logic is derived
 * primarily from the expected output passed as parameter
 */
