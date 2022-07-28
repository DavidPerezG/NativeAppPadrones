// External dependencies
import React, {useState, useEffect, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Internal dependencies
import Header from '../../components/Header';
import SearchInput from '../../components/padronesSearchComponents/SearchInput';
import SwipeListContainer from '../../components/padronesSearchComponents/SwipeListContainer';
import {useNotification} from '../../components/DropdownalertProvider';
import ParamsListRowButtons from '../../components/padronesSearchComponents/ParamsListRowButtons';
import ModalSeleccionar from '../../components/padronesSearchComponents/ModalSeleccionar';

// Services
import {
  getVehiculo,
  deleteVehiculo,
  getEstadosVehiculo,
  getMarcasVehiculo,
  getServiciosVehiculo,
  getTiposVehiculo,
} from '../../services/recaudacion/vehiculos';

// Types
import {Vehiculo} from '../../types/vehiculoInterface';
import {ServicioVehiculo} from '../../types/serviciosVehiculoInterface';
import {EstadoVehiculo} from '../../types/estadoVehiculoInterface';
import {TipoVehiculo} from '../../types/tipoVehiculoInterface';
import {DropdownAlertType} from 'react-native-dropdownalert';
import {Option} from '../../types/option';

const parametrosVehiculo = {
  numero_de_placa: {
    label_text: 'No. de Placa',
    param_name: 'numero_de_placa',
  },
  serie: {
    label_text: 'Serie',
    param_name: 'serie',
  },
  modelo_del_vehiculo: {
    label_text: 'Modelo del Vehículo',
    param_name: 'modelo_del_vehiculo',
  },
  tarjeta_de_circulacion: {
    label_text: 'Tarjeta de Circulación',
    param_name: 'tarjeta_de_circulacion',
  },
  clave_vehicular: {
    label_text: 'Clave Vehicular',
    param_name: 'clave_vehicular',
  },
  servicio: {
    label_text: 'Servicio',
    param_name: 'servicio',
  },
  estatus_del_vehiculo: {
    label_text: 'Estatus del Vehículo',
    param_name: 'estatus_del_vehiculo',
  },
  tipo_de_vehiculo: {
    label_text: 'Tipo de Vehiculo',
    param_name: 'tipo_de_vehiculo',
  },
};

type ParamsVehiculo =
  | 'numero_de_placa'
  | 'serie'
  | 'modelo_del_vehiculo'
  | 'tarjeta_de_circulacion'
  | 'clave_vehicular'
  | 'servicio'
  | 'estatus_del_vehiculo'
  | 'tipo_de_vehiculo';
type SortingBy = 'ascending' | 'descending' | 'id';

const VehiculosSearch = () => {
  //QUESTION el delete de agencia no lo elimina de la base de datos solo me da un get de la info
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [sortingBy, setSortingBy] = useState<SortingBy>('id');
  const [selectedOption, setSelectedOption] = useState();
  const [listVehiculos, setListVehiculos] = useState<Array<Vehiculo>>();
  const [parametroPadron, setParametroPadron] =
    useState<ParamsVehiculo>('numero_de_placa');

  const [estadosVehiculo, setEstadosVehiculo] =
    useState<Array<EstadoVehiculo>>();
  const [serviciosVehiculos, setServiciosVehiculos] =
    useState<Array<ServicioVehiculo>>();
  const [tiposVehiculos, setTiposVehiculos] = useState<Array<TipoVehiculo>>();

  const notify = useNotification();
  const navigation = useNavigation();

  const currentPage = useRef<number>(1);
  const searchForm = useRef<Vehiculo>();

  // useEffect con validación de conexión estable
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      !state.isConnected
        ? showAlert('Verifique si su conexión es estable', 'Error de Conexión')
        : null;
    });

    getServicios();
    getEstados();
    getTipos();

    return () => {
      unsubscribe();
    };
  }, []);

  // alerta en header
  const showAlert = (
    mensaje?: string,
    titulo?: string,
    type?: DropdownAlertType,
  ): void =>
    notify({
      type: type || 'error',
      title: titulo || 'Problema en la busqueda',
      message: mensaje || '',
    });

  // funcion cuando hay una nueva busqueda, inicializa variable de listado y verifica si se utilizo la busqueda avanzada
  const onSearch = (searchText: string, form: object) => {
    setIsLoading(true);
    let emptyVehiculo: Vehiculo = {};
    searchForm.current = emptyVehiculo;
    searchForm.current[parametroPadron] = searchText;
    if (form) {
      searchForm.current = form;
    }
    checkSearch(searchForm.current);
  };

  // funcion que verifica que la busqueda no sea vacia y procede con la busqueda nueva
  const checkSearch = formData => {
    if (!formData) {
      showAlert('Escriba algo en la busqueda');
      setIsLoading(false);
    } else {
      currentPage.current = 1;
      searchVehiculo();
    }
  };

  //funcion para buscar agencia o continuar con la paginacion
  const searchVehiculo = async () => {
    setIsLoading(true);
    let response;
    response = await getVehiculo(searchForm.current, currentPage.current);
    if (response) {
      let convertedResponse = completeData(response.results);
      setNewVehiculo(convertedResponse);
    } else {
      showAlert('', 'No hay mas datos a mostrar', 'info');
      setIsLoading(false);
    }
  };

  // Listar los nuevos datos encontrados
  const setNewVehiculo = response => {
    let newData = listVehiculos;
    currentPage.current === 1
      ? (newData = response)
      : response.map(item => (newData = [...newData, item]));

    currentPage.current++;
    setIsLoading(false);
    sortList('id');
    setListVehiculos(newData);
  };

  //Sustituye los valores de algunos parametros tomando el numero de id y sustituyendolo por el nombre
  const completeData = data => {
    let newData = data.map((element: Vehiculo) => {
      let servicio: ServicioVehiculo | undefined;
      serviciosVehiculos &&
        (servicio = serviciosVehiculos.find(el => el.id === element.servicio));
      servicio && (element.servicio = servicio.nombre);

      let estado: EstadoVehiculo | undefined;
      estadosVehiculo &&
        (estado = estadosVehiculo.find(
          el => el.id === element.estatus_del_vehiculo,
        ));
      estado && (element.estatus_del_vehiculo = estado.nombre);

      let tipo: TipoVehiculo | undefined;
      tiposVehiculos &&
        (tipo = tiposVehiculos.find(el => el.id === element.tipo_de_vehiculo));
      tipo && (element.tipo_de_vehiculo = tipo.nombre);
      return element;
    });
    return newData;
  };

  const getMarcas = async () => {
    let response = await getMarcasVehiculo();
    return response;
  };

  const getEstados = async () => {
    let response = await getEstadosVehiculo();
    setEstadosVehiculo(response);
  };

  const getServicios = async () => {
    let response = await getServiciosVehiculo();
    setServiciosVehiculos(response);
  };

  const getTipos = async () => {
    let response = await getTiposVehiculo();
    setTiposVehiculos(response);
  };

  // Elimina un dato listado en la busqueda encontrada
  const deleteRow = async rowKey => {
    const newData = [...listVehiculos!];
    const prevIndex = listVehiculos!.findIndex(padron => padron.id === rowKey);
    let response = await deleteVehiculo(rowKey);
    newData.splice(prevIndex!, 1);

    setListVehiculos(newData);
  };

  // Crea las opciones listadas y a poder escoger dentro del modal <ModalSeleccionar />
  const createOptions = (): Array<Option> => {
    let options: Array<Option> = [];
    for (let param in parametrosVehiculo) {
      let option: Option = {
        label: parametrosVehiculo[param].label_text,
        value: parametrosVehiculo[param].param_name,
      };
      options.push(option);
    }
    console.log(options);
    return options;
  };

  // Acción a realizar al seleccionar una opción dentro del modal <ModalSeleccionar />
  const onSelectOptionModal = (opcionSeleccionada: Option) => {
    setParametroPadron(opcionSeleccionada.value);
    setIsOpen(false);
  };

  const onSelectOptionModalDelete = (opcionSeleccionada: Option) => {
    deleteRow(opcionSeleccionada.value);
    setIsOpenDelete(false);
  };

  const sortList = (value: SortingBy) => {
    if (listVehiculos) {
      console.log(sortingBy);
      value === 'ascending' ? sortListAscending() : null;
      value === 'descending' ? sortListDescending() : null;
      value === 'id' ? sortListById() : null;
    }
    value === sortingBy ? setSortingBy('id') : setSortingBy(value);
  };

  useEffect(() => {}, [sortingBy]);

  const sortListAscending = () => {
    const sortedList = listVehiculos!.sort(function (a, b) {
      return a[parametroPadron].localeCompare(b[parametroPadron]);
    });

    setListVehiculos(sortedList);
  };

  const sortListDescending = () => {
    const sortedList = listVehiculos!
      .sort(function (a, b) {
        return a[parametroPadron].localeCompare(b[parametroPadron]);
      })
      .reverse();

    setListVehiculos(sortedList);
  };

  const sortListById = () => {
    const sortedList = listVehiculos!.sort(function (a, b) {
      return a.id - b.id;
    });

    setListVehiculos(sortedList);
  };

  return (
    <>
      <Container>
        <Header
          title="Vehiculos"
          isGoBack
          onPressLeftButton={() => navigation.goBack()}
        />
        <TopContainer>
          <SearchInput
            placeholderText="Buscar Vehiculo..."
            advanceSearch="Vehiculo"
            loading={isLoading}
            onSearch={onSearch}
          />
          <Linepx />
          <ParamsListRowButtons
            labelText={parametrosVehiculo[parametroPadron].label_text}
            onDownPressed={() => sortList('descending')}
            onUpPressed={() => sortList('ascending')}
            onParamPressed={() => setIsOpen(true)}
            sortingByState={sortingBy}
          />
        </TopContainer>
        <SwipeListContainer
          data={listVehiculos}
          extraData={sortingBy}
          parameterToList={parametroPadron}
          onDelete={rowKey => {
            setSelectedOption(rowKey);
            setIsOpenDelete(true);
          }}
          onEndReached={searchVehiculo}
        />
        <FloatingButton>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              // showAlert(
              //   'Disculpa la molestia',
              //   'Funcionalidad en Mantenimiento',
              //   'info',
              // )
              getMarcas
            }>
            <FontAwesome5 name={'plus'} size={35} solid color={'#fff'} />
          </TouchableOpacity>
        </FloatingButton>
      </Container>
      <ModalSeleccionar
        headerText="Buscar y Mostrar por:"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        options={createOptions()}
        onSelect={onSelectOptionModal}
        closeButton
        onCloseButtonPressed={() => setIsOpen(false)}
      />
      <ModalSeleccionar
        headerText={
          '¿Desea Eliminar el padron ' +
          selectedOption +
          ' seleccionado? Solo sera posible si no ha sido utilizado en otros procesos'
        }
        isOpen={isOpenDelete}
        onRequestClose={() => setIsOpenDelete(false)}
        options={[{label: 'Eliminar', value: selectedOption}]}
        onSelect={onSelectOptionModalDelete}
        closeButton
        onCloseButtonPressed={() => setIsOpenDelete(false)}
      />
    </>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #eff4f8;
`;

const TopContainer = styled.View`
  padding-horizontal: 20px;
  padding-vertical: 10px;
`;

const Linepx = styled.View`
  height: 1.5px;
  width: 100%;
  background-color: #d5d5d5;
  margin-vertical: 15px;
`;

const FloatingButton = styled.View`
  background-color: #235161;
  border-radius: 100px;
  position: absolute;
  width: 70px;
  height: 70px;
  align-items: center;
  justify-content: center;
  bottom: 30px;
  right: 30px;
  elevation: 10;
`;

export default VehiculosSearch;
