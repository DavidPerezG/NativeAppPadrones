import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  AsyncStorage,
  FlatList,
} from 'react-native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import axios from 'axios';
import { getPadrones } from '../services/catalagos'
import fonts from '../utils/fonts';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';

const iconsCard = {
  Ciudadano: 'users',
  Predio: 'home',
  Empresa: 'store-alt',
  Vehiculo: 'car'
}
const nameCard = {
  Ciudadano: 'Ciudadano',
  Predio: 'Predios',
  Empresa: 'Empresa',
  Vehiculo: 'Vehiculo'
}

const Caja = () => {
  const [padrones, setPadrones] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    if (global.token === '') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'login' }],
      });
    }
  }, []);

  const fetchPadron = async () => {
    const response = await getPadrones();
    console.log(response)
    setPadrones(response);
  };

  useEffect(() => {
    fetchPadron();
  }, [])

  return (
    <Container>
      <Header title="Caja" />

      <FlatList
        data={padrones}
        renderItem={({ item }) => (
          <MenuCard
            nombreItem={item.model}
            iconName={iconsCard[item.model]}
            col="#3F3F3F"
            navPage="busqueda-padron"
          />
        )}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 5, }}
      />
    </Container>
  )
};

const Container = styled.View`
  flex: 1;
  background-color: #EFF4F8;
`;

const MenuContainer = styled.View`
  flex-direction: row;
  padding: 10px;
`;

const Label = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #141414;
  font-size: 16px;
`;

export default Caja;
