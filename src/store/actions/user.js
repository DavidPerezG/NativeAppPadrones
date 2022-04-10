// Internal dependencies
import {SET_CORTE, SET_USER_INFO} from '../reducers/user';

const dispatchSetUserInfo = (dispatch, userInfo) => {
  dispatch({
    type: SET_USER_INFO,
    payload: userInfo,
  });
};

const dispatchSetCorte = (dispatch, corte) => {
  dispatch({
    type: SET_CORTE,
    payload: corte,
  });
};

export {dispatchSetUserInfo, dispatchSetCorte};
