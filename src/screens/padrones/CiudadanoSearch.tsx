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
  getCiudadanos,
  deleteCiudadano,
} from '../../services/cuentaunicasir/ciudadanos';

// Types
import {Ciudadano} from '../../types/ciudadanoInterface';
import {DropdownAlertType} from 'react-native-dropdownalert';
import {Option} from '../../types/option';

const parametrosCiudadano = {
  clave_ciudadana: {
    label_text: 'Clave Ciudadana',
    param_name: 'clave_ciudadana',
  },
  email: {
    label_text: 'Email',
    param_name: 'email',
  },
  first_name: {
    label_text: 'Nombre',
    param_name: 'first_name',
  },
  last_name: {
    label_text: 'Apellido Paterno',
    param_name: 'last_name',
  },
  second_last_name: {
    label_text: 'Apellido Materno',
    param_name: 'second_last_name',
  },
};

type ParamsCiudadano =
  | 'clave_ciudadana'
  | 'email'
  | 'first_name'
  | 'last_name'
  | 'second_last_name';
type SortingBy = 'ascending' | 'descending' | 'id';

const CiudadanosSearch = () => {
  //QUESTION el delete de agencia no lo elimina de la base de datos solo me da un get de la info
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [sortingBy, setSortingBy] = useState<SortingBy>('id');
  const [selectedOption, setSelectedOption] = useState();
  const [listCiudadanos, setListCiudadanos] = useState<Array<Ciudadano>>();
  const [parametroPadron, setParametroPadron] =
    useState<ParamsCiudadano>('email');

  const notify = useNotification();
  const navigation = useNavigation();

  const currentPage = useRef<number>(1);
  const searchForm = useRef<Ciudadano>();

  // useEffect con validación de conexión estable
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      !state.isConnected
        ? showAlert('Verifique si su conexión es estable', 'Error de Conexión')
        : null;
    });

    return () => {
      unsubscribe();
      setListCiudadanos([]);
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
    let emptyCiudadano: Ciudadano = {};
    searchForm.current = emptyCiudadano;
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
      searchCiudadano();
    }
  };

  //funcion para buscar agencia o continuar con la paginacion
  const searchCiudadano = async () => {
    console.log('buscarndo');
    setIsLoading(true);
    let response;
    response = await getCiudadanos(searchForm.current, currentPage.current);
    if (response) {
      setNewCiudadanos(response.results);
    } else {
      showAlert('', 'No hay mas datos a mostrar', 'info');
      setIsLoading(false);
    }
  };

  // Listar los nuevos datos encontrados
  const setNewCiudadanos = response => {
    let newData = listCiudadanos;
    currentPage.current === 1
      ? (newData = response)
      : response.map(item => (newData = [...newData, item]));

    currentPage.current++;
    setIsLoading(false);
    sortList('id');
    setListCiudadanos(newData);
  };

  // Elimina un dato listado en la busqueda encontrada
  const deleteRow = async rowKey => {
    const newData = [...listCiudadanos!];
    const prevIndex = listCiudadanos!.findIndex(padron => padron.id === rowKey);
    let response = await deleteCiudadano(rowKey);
    newData.splice(prevIndex!, 1);

    setListCiudadanos(newData);
  };

  // Crea las opciones listadas y a poder escoger dentro del modal <ModalSeleccionar />
  const createOptions = (): Array<Option> => {
    let options: Array<Option> = [];
    for (let param in parametrosCiudadano) {
      let option: Option = {
        label: parametrosCiudadano[param].label_text,
        value: parametrosCiudadano[param].param_name,
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
    if (listCiudadanos) {
      console.log(sortingBy);
      value === 'ascending' ? sortListAscending() : null;
      value === 'descending' ? sortListDescending() : null;
      value === 'id' ? sortListById() : null;
    }
    value === sortingBy ? setSortingBy('id') : setSortingBy(value);
  };

  useEffect(() => {}, [sortingBy]);

  const sortListAscending = () => {
    const sortedList = listCiudadanos!.sort(function (a, b) {
      return a[parametroPadron].localeCompare(b[parametroPadron]);
    });

    setListCiudadanos(sortedList);
  };

  const sortListDescending = () => {
    const sortedList = listCiudadanos!
      .sort(function (a, b) {
        return a[parametroPadron].localeCompare(b[parametroPadron]);
      })
      .reverse();

    setListCiudadanos(sortedList);
  };

  const sortListById = () => {
    const sortedList = listCiudadanos!.sort(function (a, b) {
      return a.id - b.id;
    });

    setListCiudadanos(sortedList);
  };

  return (
    <>
      <Container>
        <Header
          title="Ciudadanos"
          isGoBack
          onPressLeftButton={() => navigation.goBack()}
        />
        <TopContainer>
          <SearchInput
            placeholderText="Buscar Ciudadano..."
            advanceSearch="Ciudadano"
            loading={isLoading}
            onSearch={onSearch}
          />
          <Linepx />
          <ParamsListRowButtons
            labelText={parametrosCiudadano[parametroPadron].label_text}
            onDownPressed={() => sortList('descending')}
            onUpPressed={() => sortList('ascending')}
            onParamPressed={() => setIsOpen(true)}
            sortingByState={sortingBy}
          />
        </TopContainer>
        <SwipeListContainer
          data={listCiudadanos}
          extraData={sortingBy}
          parameterToList={parametroPadron}
          onDelete={rowKey => {
            setSelectedOption(rowKey);
            setIsOpenDelete(true);
          }}
          onEndReached={searchCiudadano}
        />
        <FloatingButton>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              showAlert(
                'Disculpa la molestia',
                'Funcionalidad en Mantenimiento',
                'info',
              )
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

export default CiudadanosSearch;
