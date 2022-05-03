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

import BusquedaAvanzadaCiudadano from '../components/BusquedaAvanzadaComponents/BusquedaAvanzadaCiudadano';
import BusquedaAvanzadaPredio from '../components/BusquedaAvanzadaComponents/BusquedaAvanzadaPredio';
import BusquedaAvanzadaVehiculo from '../components/BusquedaAvanzadaComponents/BusquedaAvanzadaVehiculo';
import BusquedaAvanzadaEmpresa from '../components/BusquedaAvanzadaComponents/BusquedaAvanzadaEmpresa';

import {getContribuyentes} from '../services/catalagos';
import {
  getAdeudoCiudadano,
  getAdeudoPadron,
  getCiudadano,
  getEmpresa,
  getPredio,
  getVehiculo,
} from '../services/padrones';
import {useSelector} from 'react-redux';

import fonts from '../utils/fonts';
import Header from '../components/Header';
import CardItem from '../components/CardItem';

const iconsCard = {
  Ciudadano: {numero: 1, variableDeNombre: 'nombre_completo'},
  Empresa: {numero: 2, variableDeNombre: 'razon_social'},
  Predio: {numero: 3, variableDeNombre: 'descripcion'},
  Vehiculo: {numero: 4, variableDeNombre: 'id'},
};

const CargosPadrones = ({route}) => {
  const [searchText, setSearchText] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [resultCargos, setResultCargos] = useState();
  const [newData, setNewData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importeTotal, setImporteTotal] = useState(0);
  const [nombrePadron, setNombrePadron] = useState();
  const [numeroPadron, setNumeroPadron] = useState();

  const navigation = useNavigation();
  const hasCorte = useSelector(state => Boolean(state.user.corte));

  const handleFirstConfig = async () => {
    let response = await getAdeudoPadron(route.params.data, numeroPadron);

    let total = 0;
    if (response.cargos[0] !== undefined) {
      response?.cargos?.map(cargo => {
        total = total + cargo?.importe;
      });
      setResultCargos(response?.cargos);
    } else {
      setResultCargos(undefined);
    }
    setNameSearch(route.params.data[iconsCard[nombrePadron]?.variableDeNombre]);
    setImporteTotal(total);
    setNewData(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (route.params.data) {
      handleFirstConfig();
    }
  }, [route.params.data]);

  useEffect(() => {
    checkCorte();
  }, []);

  useEffect(() => {
    setNombrePadron(route.params.padronNombre);
    setNumeroPadron(iconsCard[route.params.padronNombre]?.numero);
  }, [route.params.padronNombre]);

  const checkCorte = () => {
    if (hasCorte) {
      showAlert('Ya se encuentra un corte abierto', 'Alerta');
      navigation.navigate('menu');
    }
  };

  const showAlert = (mensaje, titulo) =>
    Alert.alert(`${titulo || 'Problema en la busqueda'}`, mensaje, [
      {
        text: 'Entendido',
        style: 'cancel',
      },
    ]);

  //Hace el get correspondiente al padron para obtener su informacion dependiendo de la busqueda
  const handleGetOneData = async (searchData, formData) => {
    let response;
    let numeroDePadron;
    if (nombrePadron === 'Ciudadano') {
      response = await getCiudadano(searchData, formData);
      numeroDePadron = 1;
    } else if (nombrePadron === 'Empresa') {
      response = await getEmpresa(searchData, formData);
      numeroDePadron = 2;
    } else if (nombrePadron === 'Predio') {
      response = await getPredio(searchData, formData);
      numeroDePadron = 3;
    } else if (nombrePadron === 'Vehiculo') {
      response = await getVehiculo(searchData, formData);
      numeroDePadron = 4;
    }

    console.log('respuesta antes de adeudo [0]');

    if (
      response === null ||
      response === undefined ||
      response[0] === undefined
    ) {
      showAlert('No se encontró nada que concuerde con la busqueda');
    } else if (response.length > 1) {
      //Hay mas de un dato para poner en caja, hay que elegir cual poner
      navigation.navigate('tabla-seleccion', {
        nombrePadron: nombrePadron,
        data: response,
      });
    } else {
      //Solo hay un dato para poner en caja, procede

      let result = await getAdeudoPadron(response[0], numeroDePadron);
      let total = 0;
      result?.cargos?.map(cargo => {
        total = total + cargo?.importe;
      });
      setResultCargos(result?.cargos);
      setNewData(true);
      setNameSearch(
        response[0][iconsCard[route.params.padronNombre]?.variableDeNombre],
      );
      setImporteTotal(total);
    }
  };

  //Maneja la funcion del boton de busqueda
  const handleSearch = async formData => {
    setIsLoading(true);
    setNewData(false);
    if ((searchText === null || searchText === '') && formData === undefined) {
      showAlert('Escriba algo en la busqueda');
    } else if (
      nombrePadron === 'Caja' ||
      nombrePadron === null ||
      nombrePadron === undefined
    ) {
      showAlert('Seleccione un padron primero');
    } else {
      if (formData !== null && formData !== undefined) {
        await handleGetOneData('', formData);
      } else {
        await handleGetOneData(searchText, formData);
      }
    }
    setIsLoading(false);
  };

  //Guarda el nombre en variable de estado de el dato correspondiente a su padrón

  const calcular = async () => {
    setIsLoading(true);
    if (importeTotal !== 0) {
      let paymentResponse = await NativeModules.RNNetPay.doTrans(
        importeTotal.toFixed(2),
      );
      console.log(paymentResponse.success);
    } else {
      showAlert('Cantidad Invalida', 'Problema en la transacción');
    }

    setIsLoading(false);
  };

  return (
    <Container>
      <Header title="Cargos" isGoBack />

      <MenuContainer>
        <SearchInput>
          <Input
            placeholder="Buscar Contribuyente..."
            placeholderTextColor={'#C4C4C4'}
            onChangeText={text => setSearchText(text)}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              handleSearch();
            }}>
            <SearchButton>
              <FontAwesome5 name={'search'} size={30} solid color={'white'} />
            </SearchButton>
          </TouchableWithoutFeedback>
          {route.params.padronNombre === 'Ciudadano' ? (
            <BusquedaAvanzadaCiudadano onSearch={handleSearch} />
          ) : null}
          {route.params.padronNombre === 'Empresa' ? (
            <BusquedaAvanzadaEmpresa onSearch={handleSearch} />
          ) : null}
          {route.params.padronNombre === 'Predio' ? (
            <BusquedaAvanzadaPredio onSearch={handleSearch} />
          ) : null}
          {route.params.padronNombre === 'Vehiculo' ? (
            <BusquedaAvanzadaVehiculo onSearch={handleSearch} />
          ) : null}
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
        {newData === true
          ? resultCargos?.map((cargo, index) => (
              <CardItem
                key={index}
                info={
                  '' +
                  route.params.padronNombre +
                  ': ' +
                  nameSearch +
                  ' $' +
                  cargo?.importe
                }
                navegar="detallesPadron"
              />
            ))
          : null}
        {newData === true &&
        (resultCargos === undefined || resultCargos === []) ? (
          <CardItem info={nameSearch + ' $ 0.00'} navegar="detallesPadron" />
        ) : (
          console.log(resultCargos)
        )}

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

  width: 100%;
  align-items: center;
  border-radius: 10px;
`;

const SearchButton = styled.View`
  background-color: gray;
  height: 46px;
  padding: 5px;
  padding-horizontal: 8px;
`;

const AdvanceSearchButton = styled.View`
  background-color: #841f36;
  height: 46px;
  padding: 5px;
  padding-horizontal: 8px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const Input = styled.TextInput`
  flex: 1;
  margin-horizontal: 5px;
  font-family: ${fonts.regular};
  color: #141414;
`;
