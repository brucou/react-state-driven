export const noop = () => {};
export const CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE = `Model update function must return valid update operations!`;
export const COMMAND_RENDER = 'render';
export const NO_STATE_UPDATE = [];
export const COMMAND_SEARCH = 'command_search';

export const PREPROCESSOR_INPUT_STAGE = 'PREPROCESSOR_INPUT_STAGE ';
export const FSM_INPUT_STAGE = 'FSM_INPUT_STAGE';
export const FSM_OUTPUT_STAGE = 'FSM_OUTPUT_STAGE';
export const GLOBAL_COMMAND_HANDLER_INPUT_STAGE = 'GLOBAL_COMMAND_HANDLER_INPUT_STAGE';
export const COMMAND_HANDLERS_OUTPUT_STAGE = 'COMMAND_HANDLERS_OUTPUT_STAGE';
export const COMMAND_HANDLER_INPUT_STAGE = 'COMMAND_HANDLER_INPUT_STAGE';
export const COMMAND_HANDLER_OUTPUT_STAGE = 'COMMAND_HANDLER_OUTPUT_STAGE';
export const ERROR_STAGE = 'ERROR_STAGE';
export const COMPLETE_STAGE = 'COMPLETE_STAGE';

export const IFRAME_CONNECT_TIMEOUT = 1000;
export const IFRAME_DEBUG_URL = '???';
export const emptyConsole = { log: noop, warn: noop, info: noop, debug: noop, error: noop, trace: noop };
