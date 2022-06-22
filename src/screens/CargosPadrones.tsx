import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  NativeModules,
  ScrollView,
  TouchableWithoutFeedback,
  Text,
  View,
} from 'react-native';
import http from '../services/http';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import * as Moment from 'moment';

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
  getAgencia,
  getVehiculo,
} from '../services/padrones';
import {
  imprimirObligaciones,
  imprimirConstancia,
  getRecibos,
} from '../services/cajaPdf';
import {useSelector} from 'react-redux';

import fonts from '../utils/fonts';
import Header from '../components/Header';
import CardItem from '../components/CardItem';
import Button from '../components/DefaultButton';
import DropdownButton from '../components/DropdownButton';

const datosExtraPadrones = {
  Ciudadano: {numero: 1, variableDeNombre: 'nombre_completo'},
  Empresa: {numero: 2, variableDeNombre: 'razon_social'},
  Predio: {numero: 3, variableDeNombre: 'descripcion'},
  Vehiculo: {numero: 4, variableDeNombre: 'id'},
  Hospedaje: {numero: 6, variableDeNombre: 'razon_social'},
  Arrendamiento: {numero: 7, variableDeNombre: 'razon_social'},
  Nomina: {numero: 8, variableDeNombre: 'razon_social'},
  Alcohol: {numero: 9, variableDeNombre: 'razon_social'},
  cedular: {numero: 10, variableDeNombre: 'razon_social'},
  'Juego De Azar': {numero: 11, variableDeNombre: 'razon_social'},
  Notario: {numero: 12, variableDeNombre: 'razon_social'},
  'Casa De Empeño ': {numero: 13, variableDeNombre: 'razon_social'},
  Agencia: {numero: 14, variableDeNombre: 'razon_social'},
};

const CargosPadrones = ({route}) => {
  const [searchText, setSearchText] = useState('');
  const [nameSearch, setNameSearch] = useState([]);

  const [padronCorrespondiente, setPadronCorrespondiente] = useState([]);
  const [resultCargos, setResultCargos] = useState([]);
  const [resultArrCargos, setResultArrCargos] = useState([]);
  const [resultPadrones, setResultPadrones] = useState([]);
  const [contribuyente, setContribuyente] = useState();
  const [importeTotal, setImporteTotal] = useState(0);

  const [nombrePadron, setNombrePadron] = useState(String());
  const [numeroPadron, setNumeroPadron] = useState(Number());

  const [newData, setNewData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingObligaciones, setLoadingObligaciones] = useState(false);
  const [loadingSituacion, setLoadingSituacion] = useState(false);

  const navigation = useNavigation();
  const corte = useSelector(state => state.user.corte);
  const hasCorte = useSelector(state => Boolean(state.user.corte));

  useEffect(() => {
    if (route.params.data) {
      handleBuscarCargos(route.params.data);
    }
  }, [route.params.data]);

  useEffect(() => {
    console.log('corriendo useEffect');

    let padron = route.params.padronNombre;

    if (datosExtraPadrones.hasOwnProperty(padron)) {
      setNombrePadron(padron);
      setNumeroPadron(datosExtraPadrones[padron]?.numero);
    } else {
      setNombrePadron('Ciudadano');
      setNumeroPadron(1);
    }
  }, [route.params.padronNombre]);

  const checkRepeatedPadron = padronToCheck => {
    for (var key in resultPadrones) {
      if (resultPadrones[key].id === padronToCheck.id) {
        return true;
      }
    }
    return false;
  };

  const checkCorte = () => {
    if (hasCorte) {
      showAlert('Ya se encuentra un corte abierto', 'Alerta');
      navigation.navigate('menu');
    }
  };

  const corteIsClosed = () => {
    const {apertura} = corte;
    const currentDay = Moment().format('DD');
    const diaApertura = Moment(apertura, 'YYYY-MM-DD').format('DD');
    if (diaApertura !== currentDay) {
      return true;
    } else {
      return false;
    }
  };

  const showAlert = (mensaje, titulo) =>
    Alert.alert(`${titulo || 'Problema en la busqueda'}`, mensaje, [
      {
        text: 'Entendido',
        style: 'cancel',
      },
    ]);

  const reduceArrCargos = cargo => {
    const {
      descuentos_especiales,
      actualizaciones,
      recargos,
      descuentos_aplicables,
      gastos,
      importe,
    } = cargo;
    let adeudo_total;
    let descuentos_de_actualizacion = 0;
    let descuentos_de_recargos = 0;
    let descuentos_gastos_totales = 0;
    let multa_recargos = 0;
    let multa_gastos = 0;
    let descuentos_de_recargos_str = '';
    let descuentos_de_actualizaciones_str = '';
    let descuentos_de_gastos_str = '';
    const recargo_total = recargos.reduce(
      (accum, curr) => accum + curr.importe_total,
      0,
    );

    recargos.forEach(item => {
      const {descuentos} = item;
      let ttlDesc;
      let ttlMultaRec;
      if (descuentos.length) {
        ttlDesc = descuentos.reduce(
          (accum, curr) => accum + curr.importe_total,
          0,
        );
        descuentos.forEach(i => {
          descuentos_de_recargos_str += `\n\r-${i.comentarios} `;
        });
      } else {
        ttlDesc = 0;
      }
      if (item?.es_multa) {
        const filteredRecargos = recargos.filter(
          recargo => recargo.es_multa === true,
        );
        ttlMultaRec = filteredRecargos.reduce(
          (accum, curr) => accum + curr.importe_total,
          0,
        );
      } else {
        ttlMultaRec = 0;
      }
      multa_recargos += ttlMultaRec;
      descuentos_de_recargos += ttlDesc;
    });
    gastos.forEach(item => {
      const {descuentos} = item;
      let ttlDesc;
      let ttlMultaGto;
      if (descuentos.length) {
        ttlDesc = descuentos.reduce(
          (accum, curr) => accum + curr.importe_total,
          0,
        );
        descuentos.forEach(i => {
          descuentos_de_gastos_str += `\n\r-${i.comentarios} `;
        });
      } else {
        ttlDesc = 0;
      }
      if (item.es_multa) {
        const filteredMultas = gastos.filter(gasto => gasto.es_multa === true);
        ttlMultaGto = filteredMultas.reduce(
          (accum, curr) => accum + curr.importe,
          0,
        );
      } else {
        ttlMultaGto = 0;
      }
      descuentos_gastos_totales += ttlDesc;
      multa_gastos += ttlMultaGto;
    });

    actualizaciones.forEach(item => {
      const {descuentos} = item;
      let ttlDesc;
      if (descuentos.length) {
        ttlDesc = descuentos.reduce(
          (accum, curr) => accum + curr.importe_total,
          0,
        );
        descuentos.forEach(i => {
          descuentos_de_actualizaciones_str += `\n\r-${i.comentarios} `;
        });
      } else {
        ttlDesc = 0;
      }
      descuentos_de_actualizacion += ttlDesc;
    });

    const descuentos_especiales_totales = descuentos_especiales.reduce(
      (accum, curr) => accum + curr.importe_total,
      0,
    );

    const descuentos_aplicables_total = descuentos_aplicables.reduce(
      (accum, curr) => accum + curr.importe_total,
      0,
    );

    const actualizaciones_totales = actualizaciones.reduce(
      (accum, curr) => accum + curr.importe_total,
      0,
    );

    const gastos_totales = gastos.reduce(
      (accum, curr) => accum + curr.importe,
      0,
    );

    const descuentos_totales =
      descuentos_aplicables_total + descuentos_especiales_totales;
    const multas_totales = multa_gastos + multa_recargos;
    adeudo_total =
      importe -
      descuentos_totales +
      (recargo_total - descuentos_de_recargos) +
      (actualizaciones_totales - descuentos_de_actualizacion) +
      (gastos_totales - descuentos_gastos_totales) +
      multas_totales;
    adeudo_total = adeudo_total;

    return {
      descuentos_de_actualizaciones_str,
      descuentos_de_recargos_str,
      descuentos_de_gastos_str,
      descuentos_gastos_totales,
      descuentos_de_recargos,
      descuentos_de_actualizacion,
      descuentos_aplicables_total,
      descuentos_especiales_totales,
      descuentos_totales,
      multas_totales,
      multa_recargos,
      multa_gastos,
      actualizaciones_totales,
      recargo_total: recargo_total - multa_recargos,
      adeudo_total,
      gastos_totales: gastos_totales - multa_gastos,
    };
  };

  //Hace el get correspondiente al padron para obtener su informacion dependiendo de la busqueda
  const handleBuscarPadron = async (searchData, formData) => {
    let response;
    if (nombrePadron === 'Ciudadano' || nombrePadron === 'Caja') {
      response = await getCiudadano(searchData, formData);
    } else if (nombrePadron === 'Predio') {
      response = await getPredio(searchData, formData);
    } else if (nombrePadron === 'Vehiculo') {
      response = await getVehiculo(searchData, formData);
    } else if (nombrePadron === 'Agencia') {
      response = await getAgencia(searchData, formData);
    } else if (nombrePadron !== undefined) {
      response = await getEmpresa(searchData, formData, nombrePadron);
    }

    if (!response || response[0] === undefined) {
      showAlert('No se encontró nada que concuerde con la busqueda');
    } else if (response.length > 1) {
      //Hay mas de un dato para poner en caja, hay que elegir cual poner
      navigation.navigate('tabla-seleccion', {
        nombrePadron: nombrePadron,
        data: response,
      });
    } else {
      response = response[0];
      handleBuscarCargos(response);
    }
  };

  const handleBuscarCargos = async padronData => {
    console.log('handleBuscarCargo');

    if (checkRepeatedPadron(padronData)) {
      showAlert('Padron ya en la lista encontrada');
    } else {
      setResultPadrones([...resultPadrones, padronData]);
      setPadronCorrespondiente([...padronCorrespondiente, nombrePadron]);
      if (contribuyente === undefined && nombrePadron === 'Ciudadano') {
        setContribuyente(padronData);
      }

      let response = await getAdeudoPadron(padronData, numeroPadron);
      let total = 0;
      let arrCargos;
      let allArrCargos = [];

      if (response?.cargos[0] !== undefined) {
        response?.cargos?.map(cargo => {
          arrCargos = reduceArrCargos(cargo);
          allArrCargos.push(arrCargos);
          total += arrCargos.adeudo_total;
        });
        setResultCargos([...resultCargos, response?.cargos]);
        setResultArrCargos([...resultArrCargos, allArrCargos]);
      } else {
        setResultCargos([...resultCargos, undefined]);
        setResultArrCargos([...resultArrCargos, undefined]);
      }

      setNameSearch([
        ...nameSearch,
        padronData[datosExtraPadrones[nombrePadron]?.variableDeNombre],
      ]);
      setImporteTotal(importeTotal + Math.round(total));
      setNewData(true);
    }

    setIsLoading(false);
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
        await handleBuscarPadron('', formData);
      } else {
        await handleBuscarPadron(searchText, formData);
      }
    }
    setNewData(true);
    setIsLoading(false);
  };

  const handleSearchContribuyente = formData => {
    if ((searchText === null || searchText === '') && formData === undefined) {
      showAlert('Escriba algo en la busqueda');
    } else {
      setIsLoading(true);
      setNewData(false);
      handleBuscarPadron(searchText, formData);
      setIsLoading(false);
    }
  };

  //Guarda el nombre en variable de estado de el dato correspondiente a su padrón

  const calcular = async () => {
    setIsLoading(true);
    if (hasCorte) {
      if (corteIsClosed) {
        if (importeTotal !== 0) {
          let paymentResponse = await NativeModules.RNNetPay.doTrans(
            importeTotal.toFixed(2),
          );
          if (paymentResponse.success === true) {
            showAlert('Pago Realizado con Exito', 'Pago Completado');
            let recibos = await getRecibos(
              contribuyente?.id,
              [{metodo: 1, importe: importeTotal}],
              resultCargos?.flatMap((cargo, index) =>
                cargo !== undefined
                  ? {
                      cargos: cargo?.map(cargo => {
                        return cargo.id;
                      }),
                      padron_id: resultPadrones[index].id,
                      tipo_de_padron:
                        datosExtraPadrones[padronCorrespondiente?.[index]]
                          .numero,
                    }
                  : [],
              ),
            );

            navigation.navigate('recibos-de-caja', {recibos});
          } else {
            showAlert(
              paymentResponse.message || 'Problema en la transaccion',
              'Error en el pago',
            );
          }
        } else {
          showAlert('Cantidad Invalida', 'Problema en la transacción');
        }
      } else {
        showAlert('Hay un Corte sin Cerrar', 'No se puede proceder');
      }
    } else {
      showAlert('Se requiere un corte abierto', 'No se puede proceder');
    }
    setIsLoading(false);
  };

  const handleObligacionesPdf = async () => {
    setLoadingObligaciones(true);
    const response = await imprimirObligaciones(contribuyente?.id, 1);
    setLoadingObligaciones(false);
    if (response) {
      navigation.navigate('preview-pdf', {base64: response});
    }
  };

  const handleSituacionPdf = async () => {
    setLoadingSituacion(true);
    const response = await imprimirConstancia(contribuyente?.id);
    setLoadingSituacion(false);
    if (response) {
      navigation.navigate('preview-pdf', {base64: response});
    }
  };

  return (
    <Container>
      <Header
        title="Cargos"
        isGoBack
        onPressLeftButton={() => navigation.goBack()}
      />

      <MenuContainer>
        <SearchInput>
          <Input
            placeholder="Buscar Contribuyente..."
            placeholderTextColor={'#C4C4C4'}
            onChangeText={text => setSearchText(text)}
          />
          <TouchableWithoutFeedback
            disabled={isLoading}
            onPress={() => {
              console.log(contribuyente);
              contribuyente === undefined
                ? handleSearchContribuyente()
                : handleSearch();
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
        {contribuyente ? (
          <TouchableWithoutFeedback onPress={() => navigation.navigate('caja')}>
            <AddButton>
              <FontAwesome5 name={'plus'} size={19} solid color={'#841F36'} />

              <Label>
                {route.params.padronNombre !== 'Caja' &&
                route.params.padronNombre
                  ? route.params.padronNombre
                  : 'Seleccionar Padron'}
              </Label>
            </AddButton>
          </TouchableWithoutFeedback>
        ) : (
          <LabelContribuyente>Buscar Contribuyente</LabelContribuyente>
        )}
        <Linepx />
        {newData === true ? (
          <FlatList
            data={resultPadrones}
            keyExtractor={item => item?.id}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
            }}
            renderItem={({item, index}) => {
              return (
                <DropdownButton
                  nombre={
                    item?.[
                      datosExtraPadrones[padronCorrespondiente[index]]
                        ?.variableDeNombre
                    ]
                  }
                  padron={padronCorrespondiente[index]}
                  cargo={resultArrCargos[index]?.reduce(
                    (accum, curr) => accum + curr.adeudo_total,
                    0,
                  )}
                  children={resultCargos[index]?.map((cargo, index) => {
                    var arrCargo = reduceArrCargos(cargo);
                    return (
                      <CardItem
                        key={index}
                        info={cargo.descripcion}
                        cargo={cargo}
                        reduceCargo={arrCargo}
                        navegar="detallesPadron"
                      />
                    );
                  })}
                />
              );
            }}
          />
        ) : null}

        {isLoading ? <ActivityIndicator size="large" color="#fc9696" /> : null}
      </MenuContainer>
      <Footer>
        <LabelContainer>
          <TotalLabel>Total</TotalLabel>
          <ValueLabel>${importeTotal}</ValueLabel>
        </LabelContainer>
        {contribuyente?.id ? (
          <Button
            loading={loadingObligaciones}
            text="Imprimir Opinión de Obligaciones"
            style={{height: 40, marginBottom: 7}}
            onPress={() => {
              handleObligacionesPdf();
            }}
          />
        ) : null}
        {contribuyente?.id ? (
          <Button
            loading={loadingSituacion}
            text="Imprimir Situación"
            style={{height: 40}}
            onPress={() => {
              handleSituacionPdf();
            }}
          />
        ) : null}
        <Row>
          <TouchableWithoutFeedback onPress={calcular}>
            <PaymentButton>
              <LabelButton>Pagar Total</LabelButton>
            </PaymentButton>
          </TouchableWithoutFeedback>
        </Row>
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

const Row = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const PaymentButton = styled.View`
  width: 100%;
  height: 50px;
  background-color: #1aa68a;
  border-radius: 10px;
  padding: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-vertical: 10px;
`;

const ReceiptButton = styled.View`
  width: 25%;
  height: 50px;
  background-color: #841f36;
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

const LabelContribuyente = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #6a6a6a;
  font-size: 16px;
  text-align: center;
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
