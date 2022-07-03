// External dependencies
import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  NativeModules,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Internal dependencies
import Header from '../../components/Header';
import SearchInput from '../../components/padronesSearchComponents/SearchInput';
import SwipeListContainer from '../../components/padronesSearchComponents/SwipeListContainer';
import {useNotification} from '../../components/DropdownalertProvider';
import CardItem from '../../components/CardItem';
// Services
import {getSearchEmpresas} from '../../services/getSearchPadrones';

// Types
import {Agencia} from '../../types/agenciaInterface';
import {DropdownAlertType} from 'react-native-dropdownalert';
import fonts from '../../utils/fonts';
import ModalSeleccionar from '../../components/padronesSearchComponents/ModalSeleccionar';
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

const AgenciasSearch = () => {
  // TODO hacer que la busqueda en el endpoint agarre el useState de parametro Padron dinamicamente
  //TODO listado y boton de parametro a enlistar quiza se mirarian mejor del mismo ancho
  //TODO checar los endpoints de delete padron y crearlos
  //TODO modal con mensaje "seguro que quieres eliminar el padron..."
  //TODO checar la funcionalidad de busqeuda avanzada, debe de ser capaz de buscar con los tres parametros posibles a la vez

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [listAgencias, setListAgencias] = useState<Array<Agencia>>();
  const [parametroPadron, setParametroPadron] =
    useState<ParamsEmpresa>('razon_social');

  const notify = useNotification();
  const navigation = useNavigation();

  const currentPage = useRef<number>(1);
  const textOnSearch = useRef<string>();
  const advanceForm = useRef();

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

  // funcion cuando hay una nueva busqueda
  const onSearch = (searchText: string, formData?: object) => {
    setIsLoading(true);
    checkSearch(searchText, formData);
  };

  const checkSearch = (searchText, formData) => {
    if (!searchText && formData === undefined) {
      showAlert('Escriba algo en la busqueda');
      setIsLoading(false);
    } else {
      currentPage.current = 1;
      advanceForm.current = formData;
      textOnSearch.current = searchText;
      searchAgencia();
    }
  };

  //funcion para buscar agencia o continuar con la paginacion
  const searchAgencia = async () => {
    setIsLoading(true);
    let response;
    advanceForm.current
      ? (response = await getSearchEmpresas(
          '',
          advanceForm.current,
          currentPage.current,
        ))
      : (response = await getSearchEmpresas(
          textOnSearch.current,
          undefined,
          currentPage.current,
        ));
    if (response) {
      setNewAgencias(response.results);
    } else {
      showAlert('', 'No hay mas datos a mostrar', 'info');
      setIsLoading(false);
    }
  };

  const setNewAgencias = response => {
    let newData = listAgencias;
    currentPage.current === 1
      ? (newData = response)
      : response.map(item => (newData = [...newData, item]));
    setListAgencias(newData);
    currentPage.current++;
    setIsLoading(false);
  };

  const deleteRow = rowKey => {
    const newData = [...listAgencias!];
    const prevIndex = listAgencias!.findIndex(padron => padron.id === rowKey);
    newData.splice(prevIndex!, 1);

    setListAgencias(newData);
  };

  const onSelectOptionModal = (opcionSeleccionada: Option) => {
    setParametroPadron(opcionSeleccionada.value);
    setIsOpen(false);
  };

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

  return (
    <>
      <Container>
        <Header
          title="Agencias"
          isGoBack
          onPressLeftButton={() => navigation.goBack()}
        />
        <TopContainer>
          <SearchInput
            placeholderText="Buscar Agencia..."
            advanceSearch="Empresa"
            loading={isLoading}
            onSearch={onSearch}
          />
          <Linepx />
          <TouchableWithoutFeedback onPress={() => setIsOpen(true)}>
            <AddButton>
              <FontAwesome5
                name={'list-ul'}
                size={19}
                solid
                color={'#841F36'}
              />

              <Label>{parametrosEmpresa[parametroPadron].label_text}</Label>
            </AddButton>
          </TouchableWithoutFeedback>
        </TopContainer>
        <SwipeListContainer
          data={listAgencias}
          parameterToList={parametroPadron}
          onDelete={deleteRow}
          onEndReached={searchAgencia}
        />
      </Container>
      <ModalSeleccionar
        headerText="Buscar y Mostrar por:"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        onSelect={onSelectOptionModal}
        options={createOptions()}
        closeButton
        onCloseButtonPressed={() => setIsOpen(false)}
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

const Label = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #841f36;
  font-size: 16px;
  margin-horizontal: 5px;
`;

export default AgenciasSearch;
