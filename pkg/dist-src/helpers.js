export function identity(x) {
  return x;
}
export function tryCatch(fn, errCb) {
  return function tryCatch() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    try {
      return fn.apply(fn, args);
    } catch (e) {
      return errCb(e, args);
    }
  };
}
/**
 *
 * @param {{console, debugEmitter, connection}} debug
 * @param errMsg
 * @returns {logError}
 */

export var logError = function logErrorCurried(debug, errMsg) {
  return function logError(e, args) {
    debug && debug.console && debug.console.error("An error occurred while executing: ", errMsg, args, e);
  };
};