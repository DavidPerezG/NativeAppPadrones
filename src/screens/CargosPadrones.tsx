import React, { useState } from 'react'
import { StyleSheet, View, TextInput, NativeModules, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import fonts from '../utils/fonts';
import Header from '../components/Header';
import CardItem from '../components/CardItem';

const CargosPadrones = () => {
  const [loading, setLoading] = useState(false);

  const calcular = async () => {
    setLoading(true);

    const paymentResponse = await NativeModules.RNNetPay.doTrans('200');

    setLoading(false);
  };

  return (
    <Container>
      <Header title="Cargos" />

      <MenuContainer>
        <AddButton>
          <FontAwesome5
            name={'plus'}
            size={19}
            solid
            color={'#841F36'}
          />

          <Label>Añadir Padron</Label>
        </AddButton>

        <Linepx />

        <CardItem navegar={"detallesPadron"} />
      </MenuContainer>

      <Footer>
        <LabelContainer>
          <TotalLabel>
            Total
          </TotalLabel>
          <ValueLabel>
            $200
          </ValueLabel>
        </LabelContainer>

        <TouchableWithoutFeedback onPress={calcular}>
          <PaymentButton>
            <LabelButton>Pagar Total</LabelButton>
          </PaymentButton>
        </TouchableWithoutFeedback>
      </Footer>
    </Container>
  )
}

export default CargosPadrones

const Container = styled.View`
  flex: 1;
  background-color: #EFF4F8;
`;
const MenuContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const Linepx = styled.View`
 height: 1.5px;
 width: 100%;
 background-color: #D5D5D5;
 margin-vertical: 15px;
`;

const AddButton = styled.View`
  width: 100%;
  height: 50px;
  background-color: #FFFFFF;
  border-radius: 10px;
  border-color: #841F36;
  border-width: 1px;
  padding: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const PaymentButton = styled.View`
  width: 100%;
  height: 50px;
  background-color: #235161;
  border-radius: 10px;
  padding: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-vertical: 20px;
`;

const Label = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #841F36;
  font-size: 16px;
  margin-horizontal: 5px;
`;

const TotalLabel = styled.Text`
  flex: 1;
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #841F36;
  font-size: 25px;
  margin-horizontal: 5px;
`;

const ValueLabel = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #841F36;
  font-size: 25px;
  margin-horizontal: 5px;
`;

const LabelButton = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #FFFFFF;
  font-size: 16px;
  margin-horizontal: 5px;
`;

const Footer = styled.View`
 height: 150px;
 width: 100%;
 background-color: #FFFFFF;
 padding-horizontal: 20px;
`;

const LabelContainer = styled.View`
 flex: 1;
 flex-direction: row;
 justify-content: center;
 align-items: center;
`;
