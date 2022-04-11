import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import fonts from '../utils/fonts';
import Header from '../components/Header';
import CardItem from '../components/CardItem';


const BusquedaPadron = () => {
  return (
    <Container>
      <Header title="Busqueda de Padron" />
      <MenuContainer>
        <SearchInput>
          <FontAwesome5
            name={'search'}
            size={19}
            solid
            color={'#C4C4C4'}
          />
          <Input placeholder='Buscar Padrones...' placeholderTextColor={'#C4C4C4'} />
        </SearchInput>

        <Linepx />

        <CardItem navegar={"cargosPadrones"} />

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

const SearchInput = styled.View`
  flex-direction: row;
  background-color: white;
  padding-horizontal: 10px;
  padding-vertical: 4px;
  width: 100%;
  align-items: center;
  border-radius: 10px;
`;

const Input = styled.TextInput`
 flex: 1;
 margin-horizontal: 5px;
 font-family: ${fonts.regular};
 color: #141414;
`;

const Linepx = styled.View`
 height: 1.5px;
 width: 100%;
 background-color: #D5D5D5;
 margin-vertical: 15px;
`;

export default BusquedaPadron

