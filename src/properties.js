export const noop = () => {};
export const emptyConsole = { log: noop, warn: noop, info: noop, debug: noop, error: noop, trace: noop };
export const COMMAND_RENDER = 'render';

export const CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE = `Model update function must return valid update operations!`;
export const NO_STATE_UPDATE = [];
export const COMMAND_SEARCH = 'command_search';
