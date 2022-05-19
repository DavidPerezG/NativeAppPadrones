import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';

import {getPadrones} from '../services/catalagos';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';

const iconsCard = {
  Ciudadano: 'users',
  Predio: 'home',
  Empresa: 'store-alt',
  Vehiculo: 'car',
  Alcohol: 'cocktail',
  Hospedaje: 'suitcase-rolling',
  Arrendamiento: 'laptop-house',
  Notario: 'handshake',
  Nomina: 'hand-holding-usd',
  cedular: 'user-tag',
  Agencia: 'hotel',
  'Casa De Empeño ': 'funnel-dollar',
  'Juego De Azar': 'dice',
};

const Caja = () => {
  const [padrones, setPadrones] = useState([]);

  const navigation = useNavigation();

  const fetchPadron = async () => {
    const response = await getPadrones();
    setPadrones(response);
  };

  const goBack = () => {
    navigation.state.params.onSelect({selected: true});
  };

  useEffect(() => {
    fetchPadron();
  }, []);

  return (
    <Container>
      <Header title="Elegir Padron" />

      <FlatList
        data={padrones}
        renderItem={({item}) => (
          <MenuCard
            nombreItem={item.model}
            iconName={iconsCard[item.model]}
            col="#3F3F3F"
            navPage="cargosPadrones"
            handleClick={false}
            navProps={navigation}
            onPress={() => goBack(item.model)}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={{flexGrow: 1, paddingHorizontal: 5}}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #eff4f8;
  align-items: center;
`;

export default Caja;
