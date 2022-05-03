import React from 'react';
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

import fonts from '../utils/fonts';
import Header from '../components/Header';

const DetallasPadron = ({route}) => {
  const navigation = useNavigation();
  return (
    <Container>
      <Header title="Detalles de Padron" />
      <MenuContainer>
        <TitleLabel>Titulo De Padron</TitleLabel>
        <Linepx />
        {route.params.selectType ? (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('cargosPadrones', {data: route.params.data});
            }}>
            <TitleLabel>Seleccionar</TitleLabel>
          </TouchableWithoutFeedback>
        ) : null}
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

export default DetallasPadron;
