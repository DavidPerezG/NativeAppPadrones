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
import {getCedulares, deleteCedular} from '../../services/empresas/cedulares';

// Types
import {Empresa} from '../../types/empresaInterface';
import {DropdownAlertType} from 'react-native-dropdownalert';
import {Option} from '../../types/option';

const parametrosEmpresa = {
  razon_social: {
    label_text: 'Razón Social',
    param_name: 'razon_social',
  },
  nombre_comercial: {
    label_text: 'Nombre Comercial',
    param_name: 'nombre_comercial',
  },
  RFC: {
    label_text: 'RFC',
    param_name: 'RFC',
  },
};

type ParamsEmpresa = 'razon_social' | 'nombre_comercial' | 'RFC';
type SortingBy = 'ascending' | 'descending' | 'id';

const CedularesSearch = () => {
  //QUESTION el delete de agencia no lo elimina de la base de datos solo me da un get de la info
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [sortingBy, setSortingBy] = useState<SortingBy>('id');
  const [selectedOption, setSelectedOption] = useState();
  const [listEmpresas, setListEmpresas] = useState<Array<Empresa>>();
  const [parametroPadron, setParametroPadron] =
    useState<ParamsEmpresa>('razon_social');

  const notify = useNotification();
  const navigation = useNavigation();

  const currentPage = useRef<number>(1);
  const searchForm = useRef<Empresa>();

  // useEffect con validación de conexión estable
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      !state.isConnected
        ? showAlert('Verifique si su conexión es estable', 'Error de Conexión')
        : null;
    });

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
    let emptyEmpresa: Empresa = {};
    searchForm.current = emptyEmpresa;
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
      searchEmpresa();
    }
  };

  //funcion para buscar agencia o continuar con la paginacion
  const searchEmpresa = async () => {
    console.log('buscarndo');
    setIsLoading(true);
    let response;
    let razon_social = searchForm.current?.razon_social;
    let nombre_comercial = searchForm.current?.nombre_comercial;
    let RFC = searchForm.current?.RFC;
    response = await getCedulares(
      razon_social,
      nombre_comercial,
      RFC,
      currentPage.current,
    );
    if (response) {
      setNewEmpresa(response.results);
    } else {
      showAlert('', 'No hay mas datos a mostrar', 'info');
      setIsLoading(false);
    }
  };

  // Listar los nuevos datos encontrados
  const setNewEmpresa = response => {
    let newData = listEmpresas;
    currentPage.current === 1
      ? (newData = response)
      : response.map(item => (newData = [...newData, item]));

    currentPage.current++;
    setIsLoading(false);
    sortList('id');
    setListEmpresas(newData);
  };

  // Elimina un dato listado en la busqueda encontrada
  const deleteRow = async rowKey => {
    const newData = [...listEmpresas!];
    const prevIndex = listEmpresas!.findIndex(padron => padron.id === rowKey);
    let response = await deleteCedular(rowKey);
    newData.splice(prevIndex!, 1);

    setListEmpresas(newData);
  };

  // Crea las opciones listadas y a poder escoger dentro del modal <ModalSeleccionar />
  const createOptions = (): Array<Option> => {
    let options: Array<Option> = [];
    for (let param in parametrosEmpresa) {
      let option: Option = {
        label: parametrosEmpresa[param].label_text,
        value: parametrosEmpresa[param].param_name,
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
    if (listEmpresas) {
      console.log(sortingBy);
      value === 'ascending' ? sortListAscending() : null;
      value === 'descending' ? sortListDescending() : null;
      value === 'id' ? sortListById() : null;
    }
    value === sortingBy ? setSortingBy('id') : setSortingBy(value);
  };

  useEffect(() => {}, [sortingBy]);

  const sortListAscending = () => {
    const sortedList = listEmpresas!.sort(function (a, b) {
      return a[parametroPadron].localeCompare(b[parametroPadron]);
    });

    setListEmpresas(sortedList);
  };

  const sortListDescending = () => {
    const sortedList = listEmpresas!
      .sort(function (a, b) {
        return a[parametroPadron].localeCompare(b[parametroPadron]);
      })
      .reverse();

    setListEmpresas(sortedList);
  };

  const sortListById = () => {
    const sortedList = listEmpresas!.sort(function (a, b) {
      return a.id - b.id;
    });

    setListEmpresas(sortedList);
  };

  return (
    <>
      <Container>
        <Header
          title="Cedulares"
          isGoBack
          onPressLeftButton={() => navigation.goBack()}
        />
        <TopContainer>
          <SearchInput
            placeholderText="Buscar Cedular..."
            advanceSearch="Empresa"
            loading={isLoading}
            onSearch={onSearch}
          />
          <Linepx />
          <ParamsListRowButtons
            labelText={parametrosEmpresa[parametroPadron].label_text}
            onDownPressed={() => sortList('descending')}
            onUpPressed={() => sortList('ascending')}
            onParamPressed={() => setIsOpen(true)}
            sortingByState={sortingBy}
          />
        </TopContainer>
        <SwipeListContainer
          data={listEmpresas}
          extraData={sortingBy}
          parameterToList={parametroPadron}
          onDelete={rowKey => {
            setSelectedOption(rowKey);
            setIsOpenDelete(true);
          }}
          onEndReached={searchEmpresa}
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

export default CedularesSearch;
