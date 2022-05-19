import React, {useEffect, useState} from 'react';
import {Text, TouchableWithoutFeedback, View, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

import fonts from '../utils/fonts';
import Header from '../components/Header';

const DatosTabla = {
  Ciudadano: [
    {
      title: 'Clave',
      parameter: 'clave_ciudadana',
    },
    {
      title: 'Correo',
      parameter: 'email',
    },
    {
      title: 'Nombre Completo',
      parameter: 'nombre_completo',
    },
    {
      title: 'Celular',
      parameter: 'numero_de_celular',
    },
    {
      title: 'CURP',
      parameter: 'CURP',
    },
    {
      title: 'RFC',
      parameter: 'RFC',
    },
  ],
  Empresa: [
    {
      title: 'ID',
      parameter: 'id',
    },
    {
      title: 'RFC',
      parameter: 'RFC',
    },
    {
      title: 'Nombre Comercial',
      parameter: 'nombre_comercial',
    },
    {
      title: 'Razón Social',
      parameter: 'razon_social',
    },
    {
      title: 'Página Web',
      parameter: 'sitio_de_internet',
    },
    {
      title: 'Tipo de Establecimiento',
      parameter: 'tipo_de_establecimiento',
    },
    {
      title: 'Domicilio Fiscal',
      parameter: 'domicilio_fiscal',
    },
  ],
  Predio: [
    {
      title: 'ID',
      parameter: 'id',
    },
    {
      title: 'RFC',
      parameter: 'RFC',
    },
    {
      title: 'Nombre Comercial',
      parameter: 'nombre_comercial',
    },
    {
      title: 'Razón Social',
      parameter: 'razon_social',
    },
    {
      title: 'Página Web',
      parameter: 'sitio_de_internet',
    },
    {
      title: 'Tipo de Establecimiento',
      parameter: 'tipo_de_establecimiento',
    },
    {
      title: 'Domicilio Fiscal',
      parameter: 'domicilio_fiscal',
    },
  ],
};

const DetallesSeleccion = ({route}) => {
  const [data, setData] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    console.log('detalles');
    setData(route.params.data);
  }, []);

  return (
    <Container>
      <Header title="Detalles de Selección" />
      <MenuContainer>
        <TitleLabel>{route.params.nombrePadron}</TitleLabel>
        <FlatList
          data={DatosTabla[route.params.nombrePadron]}
          renderItem={({item, index}) => (
            <Row>
              <DataLabel>{item.title}</DataLabel>
              <View style={{flex: 1}}>
                <TextLeft>{data?.[item.parameter]}</TextLeft>
              </View>
            </Row>
          )}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('cargosPadrones', {
              data: route.params.data,
            });
          }}>
          <TitleLabel>Seleccionar</TitleLabel>
        </TouchableWithoutFeedback>
      </MenuContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #eff4f8;
`;
const MenuContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const TitleLabel = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #353535;
  font-size: 25px;
  margin-horizontal: 5px;
`;

const DataLabel = styled.Text`
  font-family: ${fonts.medium};
  color: #353535;
  font-size: 15px;
`;

const Linepx = styled.View`
  height: 1.5px;
  width: 100%;
  background-color: #d5d5d5;
  margin-vertical: 15px;
`;

const SelectButton = styled.View`
  height: 55px;
  background-color: white;
  border-radius: 25px;
  padding-horizontal: 20px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const Row = styled.View`
  align-items: center;
  height: 50px;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const TextLeft = styled.Text`
  color: black;
  font-family: ${fonts.light};
  text-align: right;
`;

export default DetallesSeleccion;
