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
 * @returns {logError}
 */
export const logError = function logErrorCurried(debug, errMsg) {
  return function logError(e, args) {
    debug &&
    debug.console &&
    debug.console.error(`An error occurred while executing: `, errMsg, args, e);
  };
};

export const getStateTransducerRxAdapter = RxApi => {
  const { Subject } = RxApi;

  return new Subject();
};

export const getEventEmitterAdapter = emitonoff => {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const subscribers = [];

  const subject = {
    next: x => {
      try {
        eventEmitter.emit(DUMMY_NAME_SPACE, x);
      } catch (e) {
        subject.error(e);
      }
    },
    error: e => {
      throw e;
    },
    complete: () =>
      subscribers.forEach(f => eventEmitter.off(DUMMY_NAME_SPACE, f)),
    subscribe: ({ next: f, error: errFn, complete: __ }) => {
      subscribers.push(f);
      eventEmitter.on(DUMMY_NAME_SPACE, f);
      subject.error = errFn;
      return { unsubscribe: subject.complete };
    }
  };
  return subject;
};
