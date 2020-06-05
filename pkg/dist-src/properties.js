export var noop = function noop() {};
export var emptyConsole = {
  log: noop,
  warn: noop,
  info: noop,
  debug: noop,
  error: noop,
  trace: noop
};
export var COMMAND_RENDER = 'render';
export var CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE = "Model update function must return valid update operations!";
export var NO_STATE_UPDATE = [];
export var COMMAND_SEARCH = 'command_search';