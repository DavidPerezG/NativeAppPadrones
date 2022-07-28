// External dependencies
import React, {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';
import {ActivityIndicator, TouchableWithoutFeedback, Alert} from 'react-native';

// Internal dependencies
import Header from '../components/Header';
import fonts from '../utils/fonts';
import ModalPicker from '../components/ModalPicker';
import {getUnidadesDeRecaudacion} from '../services/configuracion';
import {abrirCorte} from '../services/recaudacion';
import {dispatchSetCorte} from '../store/actions/user';
import ModalMessage from '../components/ModalMessage';
import {useNavigation} from '@react-navigation/native';
import {getUserInfo} from '../services/user';
import {dispatchSetUserInfo} from '../store/actions/user';

const AbrirCorteScreen = () => {
  // Component's state
  const [unidadesDeRecaudacion, setUnidadesDeRecaudacion] = useState([]);
  const [unidadDeRecaudacion, setUnidadDeRecaudacion] = useState();
  const [total, setTotal] = useState<string>('');
  const [showPicker, setShowPicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Navigation
  const navigation = useNavigation();

  // Redux
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    fetchUnidades();
  }, []);

  const showAlert = (mensaje, titulo) =>
    Alert.alert(`${titulo || 'Problema en la busqueda'}`, mensaje, [
      {
        text: 'Entendido',
        style: 'cancel',
      },
    ]);

  const setUserInfo = async () => {
    const userInfo = await getUserInfo();

    if (userInfo) {
      dispatchSetUserInfo(dispatch, userInfo);

      return;
    }
  };

  // Handlers
  const fetchUnidades = async () => {
    setIsFetching(true);
    const response = await getUnidadesDeRecaudacion();
    setUnidadesDeRecaudacion(response);
    setIsFetching(false);
  };

  const pickerOptions = useMemo(() => {
    return unidadesDeRecaudacion.map(unidad => ({
      label: unidad.descripcion,
      value: unidad.id,
    }));
  }, [unidadesDeRecaudacion]);

  const onSelect = option => {
    const item = unidadesDeRecaudacion.find(unidad => unidad.id === option);
    setUnidadDeRecaudacion(item);
  };

  const onSubmit = async () => {
    setIsLoading(true);

    // validate total
    const regexFloatOrInt = /^\d+(\.\d{1,2})?$/;

    if (!unidadDeRecaudacion || !regexFloatOrInt.test(total)) {
      setErrorMessage('Error de captura, verifique los datos');
      setIsLoading(false);
      return;
    }

    // @ts-ignore
    const response = await abrirCorte(total, unidadDeRecaudacion.id);
    setUserInfo();
    if (!response.response === null) {
      dispatchSetCorte(dispatch, response);
      navigation.reset({
        index: 0,
        // @ts-ignore
        routes: [{name: 'menu'}],
      });
    } else {
      showAlert(response?.message, 'Error al abrir corte');
    }

    setIsLoading(false);
  };

  return (
    <>
      <Container>
        <Header
          title="Abrir Corte"
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

        <KeyboardAwareScrollView
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{padding: 20}}>
          <InputContainer>
            <Label>Unidad de recaudación</Label>

            <InputInnerContainer>
              <TouchableWithoutFeedback
                onPress={() => setShowPicker(true)}
                disabled={isFetching || isLoading}>
                <PickerDisplayValue isPlaceholder={!unidadDeRecaudacion}>
                  {unidadDeRecaudacion
                    ? // @ts-ignore
                      unidadDeRecaudacion.descripcion
                    : 'Seleccione una unidad de recaudación'}
                </PickerDisplayValue>
              </TouchableWithoutFeedback>
            </InputInnerContainer>
          </InputContainer>

          <InputContainer>
            <Label>Total de fondo (Efectivo)</Label>

            <InputInnerContainer>
              <Input
                value={total}
                onChangeText={value => setTotal(value)}
                placeholder="$0.00"
                keyboardType="numeric"
                placeholderTextColor="#aaaaaa"
                editable={!isFetching && !isLoading}
              />
            </InputInnerContainer>
          </InputContainer>

          <TouchableWithoutFeedback
            onPress={onSubmit}
            disabled={isFetching || isLoading}>
            <Button>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ButtonText>Abrir corte</ButtonText>
              )}
            </Button>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </Container>

      <ModalPicker
        title="Unidad de Recaudación"
        onClose={() => setShowPicker(false)}
        isVisible={showPicker}
        value={unidadDeRecaudacion}
        onSelect={onSelect}
        options={pickerOptions}
      />

      <ModalMessage
        message={errorMessage}
        clearMessage={() => setErrorMessage('')}
      />
    </>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #eff4f8;
`;

const InputContainer = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #141414;
  font-size: 16px;
`;

const InputInnerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #dcdcdc;
`;

const Input = styled.TextInput`
  padding-horizontal: 15px;
  width: 100%;
  color: #141414;
`;

const PickerDisplayValue = styled.Text<{isPlaceholder?: boolean}>`
  padding-vertical: 10px;
  padding-horizontal: 15px;
  color: ${props => (props.isPlaceholder ? '#aaaaaa' : '#141414')};
`;

const Button = styled.View`
  padding: 15px;
  background-color: #d2b15b;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #ffffff;
  font-size: 16px;
`;

export default AbrirCorteScreen;
