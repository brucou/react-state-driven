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
 * @typedef {{command : COMMAND_RENDER, params : *  }} RenderCommand
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
 * @property {EventHandler} eventHandler Interface for event processing.
 * @property {Options} options Interface for event processing.
 */
/**
 * @typedef {function (RawEventSource) : MachineEventSource} EventPreprocessor
 */
/**
 * @typedef {Object} EventHandler
 * @property {function(): Subject} subjectFactory Returns a subject which implements the observer (`next`, `error`,
 * `complete`) and observable (`subscribe`) interface.
 */
/**
 * @typedef {Observable} MachineEventSource
 */
/**
 * @typedef {Subject} RawEventSource
 */
/**
 * @typedef {function(Emitter, Params, EffectHandlers): *} CommandHandler A command handler receives parameters to
 * perform its command. EffectHandlers are injected for the command handler to delegate effect execution. An
 * `Emitter` is also available for sending events to the state machine's `RawEventSource`. An emitter correspond to
 * the `next` property of the `Observer` interface
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

// For testing
/**
 * @typedef {Object.<ControlState, ActionFactory>} EntryActions
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
