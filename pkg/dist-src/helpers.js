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
export var getStateTransducerRxAdapter = function getStateTransducerRxAdapter(RxApi) {
  var Subject = RxApi.Subject;
  return new Subject();
};
export var getEventEmitterAdapter = function getEventEmitterAdapter(emitonoff) {
  var eventEmitter = emitonoff();
  var DUMMY_NAME_SPACE = "_";
  var subscribers = [];
  var subject = {
    next: function next(x) {
      try {
        eventEmitter.emit(DUMMY_NAME_SPACE, x);
      } catch (e) {
        subject.error(e);
      }
    },
    error: function error(e) {
      throw e;
    },
    complete: function complete() {
      return subscribers.forEach(function (f) {
        return eventEmitter.off(DUMMY_NAME_SPACE, f);
      });
    },
    subscribe: function subscribe(_ref) {
      var f = _ref.next,
          errFn = _ref.error,
          __ = _ref.complete;
      subscribers.push(f);
      eventEmitter.on(DUMMY_NAME_SPACE, f);
      subject.error = errFn;
      return {
        unsubscribe: subject.complete
      };
    }
  };
  return subject;
};