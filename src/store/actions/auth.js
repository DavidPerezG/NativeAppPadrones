// Constants
import {LOGIN, SET_ACCESS_TOKEN, CLEAR_AUTH} from '../reducers/auth';

const dispatchLogin = (dispatch, {access, last_login, refresh}) => {
  dispatch({
    type: LOGIN,
    payload: {
      access,
      last_login,
      refresh,
    },
  });
};

const dispatchSetAccessToken = (dispatch, token) => {
  dispatch({
    type: SET_ACCESS_TOKEN,
    payload: token,
  });
};

const dispatchSetRefreshToken = (dispatch, token) => {
  dispatch({
    type: SET_ACCESS_TOKEN,
    payload: token,
  });
};

const dispatchClearAuth = dispatch => {
  dispatch({
    type: CLEAR_AUTH,
  });
};

export {
  dispatchLogin,
  dispatchSetAccessToken,
  dispatchSetRefreshToken,
  dispatchClearAuth,
};
