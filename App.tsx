import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamList} from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
// Screens
import Login from './src/screens/Login';
import Menu from './src/screens/Menu';
import Caja from './src/screens/Caja';
// Initialize the stack navigator

const AppContainer = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="menu" component={Menu} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="caja" component={Caja} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default () => <AppContainer />;
