import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import styled from 'styled-components/native';

import fonts from '../utils/fonts';
import Header from '../components/Header';

const DetallasPadron = () => {
  return (
    <Container>
      <Header title="Detalles de Padron" />
      <MenuContainer>
        <TitleLabel>
          Titulo De Padron
        </TitleLabel>
        <Linepx />
      </MenuContainer>
    </Container>
  )
}


const Container = styled.View`
  flex: 1;
  background-color: #EFF4F8;
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
 background-color: #D5D5D5;
 margin-vertical: 15px;
`;

export default DetallasPadron
