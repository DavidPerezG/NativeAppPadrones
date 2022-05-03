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
import BusquedaPadron from './src/screens/BusquedaPadron';
import CargosPadrones from './src/screens/CargosPadrones';
import DetallesPadron from './src/screens/DetallasPadron';
import ProfileScreen from './src/screens/Profile';
import DetalleDeCorteScreen from './src/screens/DetalleDeCorte';
import BusquedaAvanzadaCiudadano from './src/components/BusquedaAvanzadaComponents/BusquedaAvanzadaCiudadano';
import TablaSeleccion from './src/screens/TablaSeleccion';

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
      <Stack.Screen name="busqueda-padron" component={BusquedaPadron} />
      <Stack.Screen name="cargosPadrones" component={CargosPadrones} />
      <Stack.Screen name="detallesPadron" component={DetallesPadron} />
      <Stack.Screen name="profile" component={ProfileScreen} />
      <Stack.Screen name="detalle-de-corte" component={DetalleDeCorteScreen} />
      <Stack.Screen name="tabla-seleccion" component={TablaSeleccion} />
      <Stack.Screen
        name="busqueda-avanzada-ciudadano"
        component={BusquedaAvanzadaCiudadano}
      />
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
