// External dependencies
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';

// Internal dependencies
import {RootStackParamList} from './src/types/navigation';
import {persistor, store} from './src/store/index';

// Screens
import Login from './src/screens/Login';
import Menu from './src/screens/Menu';
import Caja from './src/screens/Caja';
import LoadingScreen from './src/screens/Loading';
import AbrirCorteScreen from './src/screens/AbrirCorte';
import ProfileScreen from './src/screens/Profile';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContainer = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="loading" component={LoadingScreen} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="menu" component={Menu} />
      <Stack.Screen name="caja" component={Caja} />
      <Stack.Screen name="abrir-corte" component={AbrirCorteScreen} />
      <Stack.Screen name="profile" component={ProfileScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
};
