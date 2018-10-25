/**
 * @typedef {NO_OUTPUT} NoCommand
 */
/**
 * @typedef {Subject} EventSource
 */
/**
 * @typedef {function (EventSource) : Observable} IntentSourceFactory
 */
/**
 * @typedef {String} EventName
 */
/**
 * @typedef {*} EventData
 */
/**
 * @typedef {String} CommandName
 */
/**
 * @typedef {RenderCommand | SystemCommand} Command
 */
/**
 * @typedef {{command : COMMAND_RENDER, params : (function (trigger:EventDispatcher):React.Component)  }} RenderCommand
 */
/**
 * @typedef {{command : CommandName, params : * }} SystemCommand
 */
/**
 * @typedef {function(...EventData):*} EventCallback
 */
/**
 * @typedef {function(EventName):EventCallback} EventDispatcher
 */
