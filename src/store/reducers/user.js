// Actions
export const SET_USER_INFO = 'USER_SET_USER_INFO';
export const CLEAR_USER_INFO = 'USER_CLEAR_USER_INFO';
export const SET_CORTE = 'USER_SET_CORTE';

// Action handlers
const clearUserInfo = () => ({
  id: null,
  email: null,
  first_name: null,
  last_name: null,
  second_last_name: null,
  tema: null,
  email_alternativo: null,
  numero_de_celular: null,
  lada: null,
  fecha_de_vencimiento: null,
  observaciones: null,
  foto: null,
  firma_electronica: null,
  funcionario: null,
  es_externo: null,
  funcion_del_usuario_externo: null,
  justificacion: null,
  is_active: null,
  entidad_municipal: null,
  roles: null,
  permisos: null,
  unidad_de_recaudacion: null,
  canal_de_pago: null,
  es_administrador: null,
  corte: null,
});

const setUSerInfo = (state, action) => {
  if (!action.payload) {
    return clearUserInfo();
  }

  return {
    ...state,
    ...action.payload,
  };
};

const setCorte = (state, action) => {
  return {
    ...state,
    corte: action.payload,
  };
};

const ACTION_HANDLERS = {
  [SET_USER_INFO]: setUSerInfo,
  [CLEAR_USER_INFO]: clearUserInfo,
  [SET_CORTE]: setCorte,
};

const initialState = {
  id: null,
  email: null,
  first_name: null,
  last_name: null,
  second_last_name: null,
  tema: null,
  email_alternativo: null,
  numero_de_celular: null,
  lada: null,
  fecha_de_vencimiento: null,
  observaciones: null,
  foto: null,
  firma_electronica: null,
  funcionario: null,
  es_externo: null,
  funcion_del_usuario_externo: null,
  justificacion: null,
  is_active: null,
  entidad_municipal: null,
  roles: null,
  permisos: null,
  unidad_de_recaudacion: null,
  canal_de_pago: null,
  es_administrador: null,
  corte: null,
};

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};
