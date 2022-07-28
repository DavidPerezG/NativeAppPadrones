//External dependencies
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {DropdownAlertType} from 'react-native-dropdownalert';

// Internal dependencies
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import {useNotification} from '../components/DropdownalertProvider';

//Services
import {getPadrones} from '../services/catalagos';

// Types & Interfaces
import {Padron} from '../types/padronInterface';

const padronParams = {
  Ciudadano: {icon_name: 'users', nav_page: 'ciudadanos-search'},
  Predio: {icon_name: 'home', nav_page: ''},
  Empresa: {icon_name: 'store-alt', nav_page: 'empresas-search'},
  Vehiculo: {icon_name: 'car', nav_page: 'vehiculos-search'},
  Alcohol: {icon_name: 'cocktail', nav_page: 'alcoholes-search'},
  Hospedaje: {icon_name: 'suitcase-rolling', nav_page: 'hospedajes-search'},
  Arrendamiento: {icon_name: 'laptop-house', nav_page: 'arrendamientos-search'},
  Notario: {icon_name: 'handshake', nav_page: 'notarios-search'},
  Nomina: {icon_name: 'hand-holding-usd', nav_page: 'nominas-search'},
  cedular: {icon_name: 'user-tag', nav_page: 'cedulares-search'},
  Agencia: {icon_name: 'hotel', nav_page: 'agencias-search'},
  'Casa De Empeño ': {
    icon_name: 'funnel-dollar',
    nav_page: 'casas-de-empenio-search',
  },
  'Juego De Azar': {icon_name: 'dice', nav_page: 'juegos-de-azar-search'},
};

const ListadoPadrones = () => {
  const [padrones, setPadrones] = useState<Array<Padron>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigation = useNavigation();

  const notify = useNotification();

  const showAlert = (
    mensaje?: string,
    titulo?: string,
    type?: DropdownAlertType,
  ) =>
    notify({
      type: type || 'error',
      title: titulo || 'Problema en la busqueda',
      message: mensaje || '',
    });

  const fetchPadron = async () => {
    setIsLoading(true);
    const response = await getPadrones();
    setPadrones(response);
    setIsLoading(false);
  };

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          // @ts-ignore
          name: 'menu',
        },
      ],
    });
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
            unable={item.model === 'Predio'}
            navPage={padronParams[item.model].nav_page}
            handleClick={true}
            navProps={navigation}
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
