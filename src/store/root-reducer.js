// External dependencies
import storage from '@react-native-async-storage/async-storage';
import {persistCombineReducers} from 'redux-persist';
import hardset from 'redux-persist/lib/stateReconciler/hardSet';
import {createFilter} from 'redux-persist-transform-filter';

// Internal dependencies
import auth from './reducers/auth';
import app from './reducers/app';
import user from './reducers/user';
import caja from './reducers/caja';

const authFilter = createFilter('auth', ['last_login', 'refresh']);
const appFilter = createFilter('app', []);
const userFilter = createFilter('user', []);
const cajaFilter = createFilter('caja', []);

const config = {
  key: 'root',
  storage,
  stateReconcilier: hardset,
  transforms: [authFilter, appFilter, userFilter, cajaFilter],
};

export default () =>
  persistCombineReducers(config, {
    auth,
    app,
    user,
    caja,
  });
