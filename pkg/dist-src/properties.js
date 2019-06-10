export var noop = function noop() {};
export var CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE = "Model update function must return valid update operations!";
export var NO_STATE_UPDATE = [];
export var COMMAND_SEARCH = 'command_search';
export var PREPROCESSOR_INPUT_STAGE = 'PREPROCESSOR_INPUT_STAGE ';
export var FSM_INPUT_STAGE = 'FSM_INPUT_STAGE';
export var FSM_OUTPUT_STAGE = 'FSM_OUTPUT_STAGE';
export var COMMAND_HANDLERS_OUTPUT_STAGE = 'COMMAND_HANDLERS_OUTPUT_STAGE';
export var COMMAND_HANDLER_INPUT_STAGE = 'COMMAND_HANDLER_INPUT_STAGE';
export var COMMAND_HANDLER_OUTPUT_STAGE = 'COMMAND_HANDLER_OUTPUT_STAGE';
export var ERROR_STAGE = 'ERROR_STAGE';
export var COMPLETE_STAGE = 'COMPLETE_STAGE';
export var emptyConsole = {
  log: noop,
  warn: noop,
  info: noop,
  debug: noop,
  error: noop,
  trace: noop
};