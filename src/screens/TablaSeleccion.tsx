import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';

import Header from '../components/Header';
import CardItem from '../components/CardItem';

const nameVarPadron = {
  Ciudadano: 'nombre_completo',
  Predio: 'descripcion',
  Empresa: 'razon_social',
  Vehiculo: 'id',
  Hospedaje: 'razon_social',
  Arrendamiento: 'razon_social',
  Nomina: 'razon_social',
  Alcohol: 'razon_social',
  cedular: 'razon_social',
  'Juego De Azar': 'razon_social',
  Notario: 'razon_social',
  'Casa De Empeño ': 'razon_social',
  Agencia: 'razon_social',
  Contribuyente: 'nombre_completo',
};

const TablaSeleccion = ({route}) => {
  const [data, setData] = useState([]);
  const [nombrePadron, setNombrePadron] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    setData(route.params.data);
    setNombrePadron(route.params.nombrePadron);
    listData();

    return () => {};
  }, []);

  const listData = () => {};

  return (
    <Container>
      <Header
        title="Seleccionar Opción"
        isGoBack
        onPressLeftButton={() => navigation.goBack()}
      />
      <TextTitle>{nombrePadron}</TextTitle>
      <MenuContainer>
        <FlatList
          data={data}
          renderItem={({item, index}) => (
            <CardItem
              info={item[nameVarPadron[nombrePadron]]}
              navegar="detalles-seleccion"
              selectType
              padron={nombrePadron}
              data={item}
              key={index}
            />
          )}
        />
      </MenuContainer>
    </Container>
  );
};

export default TablaSeleccion;

const Container = styled.View`
  flex: 1;
  background-color: #eff4f8;
`;
const MenuContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const TextTitle = styled.Text`
  color: black;
`;
