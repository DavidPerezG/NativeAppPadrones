import {
  SET_PADRONES,
  ADD_PADRON,
  CLEAR_CAJA,
  REMOVE_PADRON,
} from '../reducers/caja';

const dispatchSetPadrones = (dispatch, padrones) => {
  dispatch({
    type: SET_PADRONES,
    payload: padrones,
  });
};

const dispatchAddPadron = (dispatch, padron) => {
  dispatch({
    type: ADD_PADRON,
    payload: padron,
  });
};

const dispatchClearCaja = dispatch => {
  dispatch({
    type: CLEAR_CAJA,
  });
};

const dispatchRemovePadron = (dispatch, index) => {
  dispatch({
    type: REMOVE_PADRON,
    payload: index,
  });
};

export {
  dispatchSetPadrones,
  dispatchAddPadron,
  dispatchClearCaja,
  dispatchRemovePadron,
};
