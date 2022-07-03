import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, FlatList} from 'react-native';
import styled from 'styled-components/native';

import {getPadrones} from '../services/catalagos';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';

import {Padron} from '../types/padronInterface';

const padronParams = {
  Ciudadano: {icon_name: 'users', nav_page: ''},
  Predio: {icon_name: 'home', nav_page: ''},
  Empresa: {icon_name: 'store-alt', nav_page: ''},
  Vehiculo: {icon_name: 'car', nav_page: ''},
  Alcohol: {icon_name: 'cocktail', nav_page: ''},
  Hospedaje: {icon_name: 'suitcase-rolling', nav_page: ''},
  Arrendamiento: {icon_name: 'laptop-house', nav_page: ''},
  Notario: {icon_name: 'handshake', nav_page: ''},
  Nomina: {icon_name: 'hand-holding-usd', nav_page: ''},
  cedular: {icon_name: 'user-tag', nav_page: ''},
  Agencia: {icon_name: 'hotel', nav_page: 'agencias-search'},
  'Casa De Empeño ': {icon_name: 'funnel-dollar', nav_page: ''},
  'Juego De Azar': {icon_name: 'dice', nav_page: ''},
};

const ListadoPadrones = () => {
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
    navigation.goBack();
  };

  useEffect(() => {
    fetchPadron();
  }, []);

  return (
    <Container>
      <Header
        title="Elegir Padron"
        isGoBack
        onPressLeftButton={() => goBack()}
      />
      {isLoading ? <ActivityIndicator size={'large'} color="#235161" /> : null}
      <FlatList
        data={padrones}
        renderItem={({item}) => (
          <MenuCard
            nombreItem={item.model}
            iconName={padronParams[item.model].icon_name}
            color="#3F3F3F"
            navPage={padronParams[item.model].nav_page}
            handleClick={false}
            navProps={navigation}
            onPress={() => console.log('pressed')}
          />
        )}
        keyExtractor={item => item.id.toString()}
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

export default ListadoPadrones;
