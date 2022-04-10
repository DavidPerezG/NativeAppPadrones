// Constants
export const LOGIN = 'AUTH_LOGIN';
export const SET_ACCESS_TOKEN = 'AUTH_SET_ACCESS_TOKEN';
export const SET_REFRESH_TOKEN = 'AUTH_SET_REFRESH_TOKEN';
export const CLEAR_AUTH = 'AUTH_CLEAR_AUTH';

// Action handlers
const loginHandler = (state, action) => {
  return {
    ...state,
    access: action.payload.access,
    last_login: action.payload.last_login,
    refresh: action.payload.refresh,
  };
};

const setAccessToken = (state, action) => {
  return {
    ...state,
    access: action.payload,
  };
};

const setRefreshToken = (state, action) => {
  return {
    ...state,
    refresh: action.payload,
  };
};

const clearAuthHandler = () => ({
  access: null,
  last_login: null,
  refresh: null,
});

// Config
const ACTION_HANDLERS = {
  [LOGIN]: loginHandler,
  [SET_ACCESS_TOKEN]: setAccessToken,
  [SET_REFRESH_TOKEN]: setRefreshToken,
  [CLEAR_AUTH]: clearAuthHandler,
};

const initialState = {
  access: null,
  last_login: null,
  refresh: null,
};

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
