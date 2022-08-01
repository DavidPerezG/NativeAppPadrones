//External dependencies
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  NativeModules,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {SwipeListView} from 'react-native-swipe-list-view';
import NetInfo from '@react-native-community/netinfo';
import {useSelector} from 'react-redux';
import {DropdownAlertType} from 'react-native-dropdownalert';

//Internal dependencies
import BusquedaAvanzadaCiudadano from '../components/BusquedaAvanzadaComponents/BusquedaAvanzadaCiudadano';
import BusquedaAvanzadaPredio from '../components/BusquedaAvanzadaComponents/BusquedaAvanzadaPredio';
import BusquedaAvanzadaVehiculo from '../components/BusquedaAvanzadaComponents/BusquedaAvanzadaVehiculo';
import BusquedaAvanzadaEmpresa from '../components/BusquedaAvanzadaComponents/BusquedaAvanzadaEmpresa';
import fonts from '../utils/fonts';
import Header from '../components/Header';
import CardItem from '../components/CardItem';
import Button from '../components/DefaultButton';
import DropdownButton from '../components/DropdownButton';
import {useNotification} from '../components/DropdownalertProvider';

//Services
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

//Types & Interfaces
import {Cargo} from '../types/cargoInterface';
import {Ciudadano} from '../types/ciudadanoInterface';
import {getContribuyenteCaja} from '../services/empresas/contribuyentesCaja';

const datosExtraPadrones = {
  Ciudadano: {numero: 1, variableDeNombre: 'nombre_completo'},
  Empresa: {numero: 2, variableDeNombre: 'nombre_comercial'},
  Predio: {numero: 3, variableDeNombre: 'descripcion'},
  Vehiculo: {numero: 4, variableDeNombre: 'id'},
  Hospedaje: {numero: 6, variableDeNombre: 'razon_social'},
  Arrendamiento: {numero: 7, variableDeNombre: 'razon_social'},
  Nomina: {numero: 8, variableDeNombre: 'clave'},
  Alcohol: {numero: 9, variableDeNombre: 'razon_social'},
  cedular: {numero: 10, variableDeNombre: 'razon_social'},
  'Juego De Azar': {numero: 11, variableDeNombre: 'razon_social'},
  Notario: {numero: 12, variableDeNombre: 'razon_social'},
  'Casa De Empeño ': {numero: 13, variableDeNombre: 'razon_social'},
  Agencia: {numero: 14, variableDeNombre: 'razon_social'},
  Contribuyente: {numero: 15, variableDeNombre: 'nombre_completo'},
};

const CargosPadrones = ({route}) => {
  // States
  const [searchText, setSearchText] = useState<string>('');
  const [nameSearch, setNameSearch] = useState<Array<object>>([]);

  const [padronCorrespondiente, setPadronCorrespondiente] = useState<
    Array<string>
  >([]);

  const [resultCargos, setResultCargos] = useState<Array<Cargo>>([]);
  const [resultArrCargos, setResultArrCargos] = useState<Array<object>>([]);
  const [resultPadrones, setResultPadrones] = useState<Array<object>>([]);
  const [contribuyente, setContribuyente] = useState<Ciudadano>();
  const [importeTotal, setImporteTotal] = useState<number>(0);
  const [netpayLoad, setNetpayLoad] = useState(false);

  const [nombrePadron, setNombrePadron] = useState<string>();
  const [numeroPadron, setNumeroPadron] = useState<number>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingObligaciones, setLoadingObligaciones] =
    useState<boolean>(false);
  const [loadingSituacion, setLoadingSituacion] = useState<boolean>(false);

  // Notification
  const notify = useNotification();

  // Navigation
  const navigation = useNavigation();

  // Redux
  const corte = useSelector(state => state.user.corte);
  const hasCorte = useSelector(state => Boolean(state.user.corte));
  // const entidadMunicipalConfig = useSelector(
  //   state => state.user.entidad_municipal.configuracion,
  // );

  const showAlert = (
    mensaje?: string,
    titulo?: string,
    type?: DropdownAlertType,
  ) =>
    notify({
      type: type || 'error',
      title: titulo || 'Problema en la busqueda',
      message: mensaje || '',
    });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      !state.isConnected
        ? showAlert('Verifique si su conexión es estable', 'Error de Conexión')
        : null;
    });

    return () => {
      unsubscribe();

      setNameSearch([]);
      setPadronCorrespondiente([]);
      setResultCargos([]);
      setResultArrCargos([]);
      setResultPadrones([]);
      setContribuyente({});
      setImporteTotal(0);
      setNombrePadron('');
      setNumeroPadron(0);
    };
  }, []);

  useEffect(() => {
    if (route.params.data) {
      handleBuscarCargos(route.params.data);
    }
  }, [route.params.data]);

  useEffect(() => {
    let padron = route.params.padronNombre;

    if (datosExtraPadrones.hasOwnProperty(padron)) {
      setNombrePadron(padron);
      setNumeroPadron(datosExtraPadrones[padron]?.numero);
    } else {
      setNombrePadron('Ciudadano');
      setNumeroPadron(1);
    }
  }, [route.params.padronNombre]);

  const checkRepeatedPadron = (padronToCheck: object): boolean => {
    for (var key in resultPadrones) {
      if (
        resultPadrones[key].id === padronToCheck.id &&
        nombrePadron === padronCorrespondiente[key]
      ) {
        return true;
      }
    }
    return false;
  };

  const corteIsClosed = (): boolean => {
    const {apertura} = corte;
    const currentDay = moment().format('DD');
    const diaApertura = moment(apertura, 'YYYY-MM-DD').format('DD');
    if (diaApertura !== currentDay) {
      return false;
    } else {
      return true;
    }
  };

  const reduceArrCargos = (cargo: Cargo) => {
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
  const handleBuscarPadron = async (searchData: string, formData?: object) => {
    setIsLoading(true);
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
    } else if (nombrePadron === 'Contribuyente') {
      response = await getContribuyenteCaja(searchData);
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
    setIsLoading(false);
  };

  const handleBuscarCargos = async (padronData: object) => {
    setIsLoading(true);
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
      setImporteTotal(
        importeTotal + Math.round((total + Number.EPSILON) * 100) / 100,
      );
    }
    setIsLoading(false);
  };

  //Maneja la funcion del boton de busqueda
  const handleSearch = (formData?: object) => {
    if ((searchText === null || searchText === '') && formData === undefined) {
      setIsLoading(false);
      showAlert('Escriba algo en la busqueda');
    } else if (
      nombrePadron === 'Caja' ||
      nombrePadron === null ||
      nombrePadron === undefined
    ) {
      showAlert('Seleccione un padron primero');
    } else {
      if (formData !== null && formData !== undefined) {
        handleBuscarPadron('', formData);
      } else {
        handleBuscarPadron(searchText, formData);
      }
    }
  };

  const handleSearchContribuyente = (formData?: object) => {
    if ((searchText === null || searchText === '') && formData === undefined) {
      showAlert('Escriba algo en la busqueda');
      setIsLoading(false);
    } else {
      handleBuscarPadron(searchText, formData);
    }
  };

  //Guarda el nombre en variable de estado de el dato correspondiente a su padrón

  const calcular = async () => {
    setNetpayLoad(true);
    setIsLoading(true);
    if (hasCorte) {
      if (corteIsClosed()) {
        if (importeTotal !== 0) {
          try {
            let paymentResponse = await NativeModules.RNNetPay.doTrans(
              importeTotal.toFixed(2),
            );
            console.log(paymentResponse);
            if (paymentResponse.success === true) {
              showAlert(
                'Pago Realizado con Exito',
                'Pago Completado',
                'success',
              );
              let recibos = await getRecibos(
                contribuyente?.id,
                [{metodo: 3, importe: importeTotal, banco: 'Netpay'}],
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
                paymentResponse,
              );

              navigation.navigate('recibos-de-caja', {recibos});
            } else {
              showAlert(
                paymentResponse.message || 'Problema en la transaccion',
                'Error en el pago',
              );
            }
          } catch (error) {
            showAlert('No se identifico dispositivo Netpay');
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
    setNetpayLoad(false);
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

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...resultPadrones];
    const newNameSearch = [...nameSearch];
    const newPadronCorrespondiente = [...padronCorrespondiente];
    const newResultCargos = [...resultCargos];
    const newResultArrCargos = [...resultArrCargos];

    const prevIndex = resultPadrones.findIndex(padron => padron.id === rowKey);
    newData.splice(prevIndex, 1);
    newNameSearch.splice(prevIndex, 1);
    newPadronCorrespondiente.splice(prevIndex, 1);
    newResultCargos.splice(prevIndex, 1);
    newResultArrCargos.splice(prevIndex, 1);
    const arrCargo = resultArrCargos[prevIndex];

    let totalAdeudo = 0;
    arrCargo
      ? arrCargo.map(cargo => {
          totalAdeudo += cargo.adeudo_total;
        })
      : null;
    setImporteTotal(importeTotal - totalAdeudo);

    setNameSearch(newNameSearch);
    setPadronCorrespondiente(newPadronCorrespondiente);
    setResultCargos(newResultCargos);
    setResultPadrones(newData);
    setResultArrCargos(newResultArrCargos);
  };

  return (
    <Container>
      <Header
        title="Cargos"
        isGoBack
        onPressLeftButton={() =>
          navigation.reset({
            index: 0,
            routes: [
              {
                // @ts-ignore
                name: 'menu',
              },
            ],
          })
        }
      />

      <MenuContainer>
        <TopContainer>
          <SearchInput>
            <Input
              placeholder="Buscar..."
              placeholderTextColor={'#C4C4C4'}
              onChangeText={text => setSearchText(text)}
            />
            <TouchableWithoutFeedback
              disabled={isLoading}
              onPress={() => {
                setIsLoading(true);
                contribuyente === undefined
                  ? handleSearchContribuyente()
                  : handleSearch();
              }}>
              <SearchButton>
                {!isLoading ? (
                  <FontAwesome5
                    name={'search'}
                    size={30}
                    solid
                    color={'white'}
                  />
                ) : (
                  <ActivityIndicator size="large" color="#ffffff" />
                )}
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
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('caja')}>
              <AddButton>
                <FontAwesome5 name={'plus'} size={19} solid color={'#841F36'} />

                <Label>
                  {nombrePadron !== 'Caja' && nombrePadron
                    ? nombrePadron
                    : 'Seleccionar Padron'}
                </Label>
              </AddButton>
            </TouchableWithoutFeedback>
          ) : (
            <LabelContribuyente>Buscar Contribuyente</LabelContribuyente>
          )}
          <Linepx />
        </TopContainer>

        <SwipeListView
          data={resultPadrones}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
          }}
          renderHiddenItem={(data, rowMap) => (
            <RowBack>
              <BackRightBtn onPress={() => closeRow(rowMap, data.item.id)}>
                <BackRightBtnLeft>
                  <FontAwesome5
                    name={'backspace'}
                    size={20}
                    solid
                    color={'white'}
                  />
                </BackRightBtnLeft>
              </BackRightBtn>
              <BackRightBtn onPress={() => deleteRow(rowMap, data.item.id)}>
                <BackRightBtnRight>
                  <FontAwesome5
                    name={'trash'}
                    size={20}
                    solid
                    color={'white'}
                  />
                </BackRightBtnRight>
              </BackRightBtn>
            </RowBack>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
          renderItem={({item, index}) => {
            return (
              <DropdownButton
                collapsable
                leftText={
                  padronCorrespondiente[index] +
                  ':' +
                  item?.[
                    datosExtraPadrones[padronCorrespondiente[index]]
                      ?.variableDeNombre
                  ]
                }
                rightText={
                  '$' +
                  (resultArrCargos[index]?.reduce(
                    (accum, curr) => accum + curr.adeudo_total,
                    0,
                  ) || 0)
                }
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
          <TouchableWithoutFeedback onPress={calcular} disabled={netpayLoad}>
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
`;

const TopContainer = styled.View`
  padding-horizontal: 20px;
  padding-vertical: 10px;
`;

const MidContainer = styled.View``;

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

const RowFront = styled.View`
  background-color: #fff;
  border-radius: 5px;
  height: 60px;
  margin: 5px;
  margin-bottom: 15px;
  elevation: 5px;
`;

const RowBack = styled.View`
  align-items: center;
  background-color: #eff4f8;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin: 5px;
  margin-bottom: 15px;
  border-radius: 5px;
`;

const BackRightBtn = styled.TouchableWithoutFeedback`
  align-items: flex-end;
  bottom: 0px;
  justify-content: center;
  position: absolute;
  top: 0px;
  width: 75px;
  padding-right: 17px;
`;

const BackRightBtnLeft = styled.View`
  background-color: #1aa68a;
  height: 100%;
  width: 75px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const BackRightBtnRight = styled.View`
  background-color: #cd4c4c;
  height: 100%;
  width: 75px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;
