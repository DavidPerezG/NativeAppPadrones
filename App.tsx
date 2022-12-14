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
import DetallesSeleccion from './src/screens/DetallesSeleccion';
import RecibosDeCaja from './src/screens/RecibosDeCaja';
import PreviewPDF from './src/screens/PreviewPDF';
import ListadoPadrones from './src/screens/ListadoPadrones';
import AgenciasSearch from './src/screens/padrones/AgenciasSearch';
import AlcoholesSearch from './src/screens/padrones/AlcoholesSearch';
import NominasSearch from './src/screens/padrones/NominasSearch';
import HospedajesSearch from './src/screens/padrones/HospedajesSearch';
import EmpresasSearch from './src/screens/padrones/EmpresasSearch';
import ArrendamientosSearch from './src/screens/padrones/ArrendamientosSearch';
import CedularesSearch from './src/screens/padrones/CedularesSearch';
import NotariosSearch from './src/screens/padrones/NotariosSearch';
import CasasDeEmpenioSearch from './src/screens/padrones/CasasDeEmpenioSearch';
import JuegosDeAzarSearch from './src/screens/padrones/JuegosDeAzarSearch';
import VehiculosSearch from './src/screens/padrones/VehiculosSearch';
import CiudadanosSearch from './src/screens/padrones/CiudadanoSearch';

import DropdownalertProvider from './src/components/DropdownalertProvider';

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
      <Stack.Screen name="detalles-seleccion" component={DetallesSeleccion} />
      <Stack.Screen name="recibos-de-caja" component={RecibosDeCaja} />
      <Stack.Screen name="preview-pdf" component={PreviewPDF} />
      <Stack.Screen name="listado-padrones" component={ListadoPadrones} />
      <Stack.Screen name="agencias-search" component={AgenciasSearch} />
      <Stack.Screen name="alcoholes-search" component={AlcoholesSearch} />
      <Stack.Screen name="nominas-search" component={NominasSearch} />
      <Stack.Screen name="hospedajes-search" component={HospedajesSearch} />
      <Stack.Screen name="empresas-search" component={EmpresasSearch} />
      <Stack.Screen
        name="arrendamientos-search"
        component={ArrendamientosSearch}
      />
      <Stack.Screen name="cedulares-search" component={CedularesSearch} />
      <Stack.Screen name="notarios-search" component={NotariosSearch} />
      <Stack.Screen
        name="casas-de-empenio-search"
        component={CasasDeEmpenioSearch}
      />
      <Stack.Screen
        name="juegos-de-azar-search"
        component={JuegosDeAzarSearch}
      />
      <Stack.Screen name="vehiculos-search" component={VehiculosSearch} />
      <Stack.Screen name="ciudadanos-search" component={CiudadanosSearch} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default () => {
  return (
    <DropdownalertProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    </DropdownalertProvider>
  );
};
