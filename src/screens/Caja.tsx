import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, FlatList} from 'react-native';
import styled from 'styled-components/native';

import {getPadrones} from '../services/catalagos';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';

import {Padron} from '../types/padronInterface';

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
  Contribuyente: 'user',
};

const Caja = () => {
  const [padrones, setPadrones] = useState<Array<Padron>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigation = useNavigation();

  const fetchPadron = async () => {
    setIsLoading(true);
    const response = await getPadrones();
    setPadrones(response);
    setIsLoading(false);
  };

  const goBack = () => {
    navigation.state.params.onSelect({selected: true});
  };

  useEffect(() => {
    fetchPadron();
    return () => {
      setPadrones([]);
    };
  }, []);

  return (
    <Container>
      <Header
        title="Elegir Padron"
        isGoBack
        onPressLeftButton={() => navigation.goBack()}
      />
      {isLoading ? <ActivityIndicator size={'large'} color="#235161" /> : null}
      <FlatList
        data={padrones}
        renderItem={({item}) => (
          <MenuCard
            nombreItem={item.model}
            iconName={iconsCard[item.model]}
            color="#3F3F3F"
            navPage="cargosPadrones"
            handleClick={false}
            navProps={navigation}
            onPress={() => goBack()}
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
