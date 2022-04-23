// constants
export const SET_PADRONES = 'CAJA_SET_PADRONES';
export const ADD_PADRON = 'CAJA_ADD_PADRON';
export const REMOVE_PADRON = 'CAJA_REMOVE_PADRON';
export const CLEAR_CAJA = 'CAJA_CLEAR_CAJA';

// actions handlers
const setPadronesActionHandler = (state, action) => {
  return {
    ...state,
    padrones: action.payload,
  };
};

const addPadronActionHandler = (state, action) => {
  const newPadrones = [...state.padrones];
  // adds new padron in to the list of padrones
  newPadrones.push(action.payload);

  return {
    ...state,
    padrones: newPadrones,
  };
};

const removePadronActionHandler = (state, action) => {
  // create a new copy of the list of padrones to change the reference
  const newPadrones = [...state.padrones];
  // Remove one padron from array of padrones.
  newPadrones.splice(action.payload, 1);

  return {
    ...state,
    padrones: newPadrones,
  };
};

const clearCajaActionHandler = (state, action) => {
  return {
    padrones: [],
  };
};

// setup

const ACTION_HANDLERS = {
  [SET_PADRONES]: setPadronesActionHandler,
  [ADD_PADRON]: addPadronActionHandler,
  [REMOVE_PADRON]: removePadronActionHandler,
  [CLEAR_CAJA]: clearCajaActionHandler,
};

const initialState = {
  padrones: [],
};

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
