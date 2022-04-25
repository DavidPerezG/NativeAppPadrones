import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  NativeModules,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';

import {getContribuyentes} from '../services/catalagos';
import {
  getAdeudoCiudadano,
  getAdeudoEmpresa,
  getAdeudoPredio,
  getAdeudoVehiculo,
} from '../services/padrones';
import {useDispatch, useSelector} from 'react-redux';
import {dispatchAddPadron} from '../store/actions/caja';

import fonts from '../utils/fonts';
import Header from '../components/Header';
import CardItem from '../components/CardItem';

const CargosPadrones = ({route}) => {
  const [contribuyente, setContribuyente] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [resultCargos, setResultCargos] = useState();
  const [newData, setNewData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [padronName, setPadronName] = useState();
  const [importeTotal, setImporteTotal] = useState(0);

  const navigation = useNavigation();

  const padrones = useSelector(state => state.caja.padrones);

  const fetchContribuyente = async () => {
    const response = await getContribuyentes();
    console.log(response);
    setContribuyente(response);
  };

  const showAlert = mensaje =>
    Alert.alert('Problema en la busqueda', mensaje, [
      {
        text: 'Entendido',
        style: 'cancel',
      },
    ]);

  useEffect(() => {
    fetchContribuyente();
    console.log(route.params.nombrePadron);
  }, []);

  const handleSearch = async formData => {
    setIsLoading(true);
    setNewData(false);
    let nombrePadron = route.params.padronNombre;
    let response;
    if (nombrePadron === 'Ciudadano') {
      response = await getAdeudoCiudadano(searchText, formData);
      response !== null ? setNameSearch(response.first_name) : null;
    } else if (nombrePadron === 'Empresa') {
      response = await getAdeudoEmpresa(searchText, formData);
      response !== null ? setNameSearch(response.nombre_comercial) : null;
      // setNameSearch(response.nombre_comercial);
    } else if (nombrePadron === 'Predio') {
      response = await getAdeudoPredio(searchText, formData);
      response !== null
        ? setNameSearch(response.cuenta_unica_de_predial)
        : null;
      // setNameSearch(response?.cuenta_unica_de_predial);
    } else if (nombrePadron === 'Vehiculo') {
      response = await getAdeudoVehiculo(searchText, formData);
      response !== null ? setNameSearch(response.numero_de_placa) : null;
      // setNameSearch(response?.numero_de_placa);
    }
    if (response === null || response === undefined) {
      setIsLoading(false);
      if (
        nombrePadron === 'Caja' ||
        nombrePadron === null ||
        nombrePadron === undefined
      ) {
        showAlert('Seleccione un padron primero');
      } else {
        showAlert('No se encontró nada que concuerde con la busqueda');
      }
    } else {
      setResultCargos(response?.cargos);
      setNewData(true);
      let total = 0;
      console.log('asdasdasdasdasdsadadasd');
      console.log(response.cargos);
      response?.cargos.map(cargo => {
        console.log('imporrtttt');
        console.log(cargo);
        total = total + cargo.importe;
      });
      console.log('termn');
      console.log(total);
      setImporteTotal(total);
    }
    console.log('response se se');
    console.log(response);
    setIsLoading(false);
  };

  const calcular = async () => {
    setLoading(true);
    const paymentResponse = await NativeModules.RNNetPay.doTrans(
      importeTotal.toFixed(2),
    );
    console.log(paymentResponse);
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
            placeholderTextColor={'#C4C4C4'}
            onChangeText={text => setSearchText(text)}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              handleSearch();
            }}>
            <FontAwesome5 name={'search'} size={19} solid color={'#C4C4C4'} />
          </TouchableWithoutFeedback>
        </SearchInput>

        <Linepx />

        <TouchableWithoutFeedback onPress={() => navigation.navigate('caja')}>
          <AddButton>
            <FontAwesome5 name={'plus'} size={19} solid color={'#841F36'} />

            <Label>
              {route.params.padronNombre !== 'Caja' && route.params.padronNombre
                ? route.params.padronNombre
                : 'Seleccionar Padron'}
            </Label>
          </AddButton>
        </TouchableWithoutFeedback>

        <Linepx />
        {/*flatlist con la lista de padrones linea 21*/}
        {newData === true && resultCargos[0] !== null
          ? resultCargos.map((cargo, index) => (
              <CardItem
                key={index}
                info={
                  '' +
                  route.params.padronNombre +
                  ': ' +
                  nameSearch +
                  ' $' +
                  cargo.importe
                }
                navegar="detallesPadron"
              />
            ))
          : null}

        {isLoading ? <ActivityIndicator size="large" color="#fc9696" /> : null}
      </MenuContainer>

      <Footer>
        <LabelContainer>
          <TotalLabel>Total</TotalLabel>
          <ValueLabel>${importeTotal}</ValueLabel>
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
