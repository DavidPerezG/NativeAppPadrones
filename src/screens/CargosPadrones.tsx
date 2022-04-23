import React, {useState, useEffect} from 'react';
import {NativeModules, TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';

import {getContribuyentes} from '../services/catalagos';
import {useDispatch, useSelector} from 'react-redux';
import {dispatchAddPadron} from '../store/actions/caja';

import fonts from '../utils/fonts';
import Header from '../components/Header';
import CardItem from '../components/CardItem';

const CargosPadrones = () => {
  const [contribuyente, setContribuyente] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const padrones = useSelector(state => state.caja.padrones);

  const fetchContribuyente = async () => {
    const response = await getContribuyentes();
    console.log(response);
    setContribuyente(response);
  };

  useEffect(() => {
    fetchContribuyente();
  }, []);

  const calcular = async () => {
    setLoading(true);
    const paymentResponse = await NativeModules.RNNetPay.doTrans('200');
    setLoading(false);
  };

  return (
    <Container>
      <Header title="Cargos" isGoBack />

      <MenuContainer>
        <SearchInput>
          <FontAwesome5 name={'search'} size={19} solid color={'#C4C4C4'} />
          <Input
            placeholder="Buscar Contribuyente..."
            placeholderTextColor={'#C4C4C4'}>
            04 - Carlos Iturrios
          </Input>
        </SearchInput>

        <Linepx />

        <TouchableWithoutFeedback onPress={() => navigation.navigate('caja')}>
          <AddButton>
            <FontAwesome5 name={'plus'} size={19} solid color={'#841F36'} />

            <Label>Añadir Padron</Label>
          </AddButton>
        </TouchableWithoutFeedback>

        <Linepx />
        {/*flatlist con la lista de padrones linea 21*/}
        <CardItem
          info={'Ciudadano: Carlos Iturrios $0.00'}
          navegar={'detallesPadron'}
        />

        <CardItem
          info={'Empresa: Acuacutores el... $0.00'}
          navegar={'detallesPadron'}
        />
      </MenuContainer>

      <Footer>
        <LabelContainer>
          <TotalLabel>Total</TotalLabel>
          <ValueLabel>$0.00</ValueLabel>
        </LabelContainer>

        <TouchableWithoutFeedback onPress={calcular}>
          <PaymentButton>
            <LabelButton>Pagar Total</LabelButton>
          </PaymentButton>
        </TouchableWithoutFeedback>
      </Footer>
    </Container>
  );
};

export default CargosPadrones;

const Container = styled.View`
  flex: 1;
  background-color: #eff4f8;
`;
const MenuContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const Linepx = styled.View`
  height: 1.5px;
  width: 100%;
  background-color: #d5d5d5;
  margin-vertical: 15px;
`;

const AddButton = styled.View`
  width: 100%;
  height: 50px;
  background-color: #ffffff;
  border-radius: 10px;
  border-color: #841f36;
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
  margin-vertical: 10px;
`;

const Label = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #841f36;
  font-size: 16px;
  margin-horizontal: 5px;
`;

const TotalLabel = styled.Text`
  flex: 1;
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #841f36;
  font-size: 25px;
  margin-horizontal: 5px;
`;

const ValueLabel = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #841f36;
  font-size: 25px;
  margin-horizontal: 5px;
`;

const LabelButton = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #ffffff;
  font-size: 16px;
  margin-horizontal: 5px;
`;

const Footer = styled.View`
  height: 140px;
  width: 100%;
  background-color: #ffffff;
  padding-horizontal: 20px;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
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
