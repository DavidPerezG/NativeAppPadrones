// External dependencies
import storage from '@react-native-async-storage/async-storage';
import {persistCombineReducers} from 'redux-persist';
import hardset from 'redux-persist/lib/stateReconciler/hardSet';
import {createFilter} from 'redux-persist-transform-filter';

// Internal dependencies
import auth from './reducers/auth';
import app from './reducers/app';
import user from './reducers/user';

const authFilter = createFilter('auth', ['last_login', 'refresh']);
const appFilter = createFilter('app', []);
const userFilter = createFilter('user', []);

const config = {
  key: 'root',
  storage,
  stateReconcilier: hardset,
  transforms: [authFilter, appFilter, userFilter],
};

export default () =>
  persistCombineReducers(config, {
    auth,
    app,
    user,
  });
