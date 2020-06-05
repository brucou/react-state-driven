export function identity(x) {return x;}

export function tryCatch(fn, errCb) {
  return function tryCatch(...args) {
    try {return fn.apply(fn, args);}
    catch (e) {
      return errCb(e, args);
    }
  };
}

/**
 *
 * @param {{console, debugEmitter, connection}} debug
 * @param errMsg
 * @returns {logAndRethrow}
 */
export const logAndRethrow = function logAndRethrowCurried(debug, errMsg) {
  return function logAndRethrow(e, args) {
    debug &&
    debug.console &&
    debug.console.error(`logAndRethrow :> errors`, errMsg, e);
    debug &&
    debug.console &&
    debug.console.error(`logAndRethrow :> args `, args);
    throw e;
  };
};
