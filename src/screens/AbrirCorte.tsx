// External dependencies
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Internal dependencies
import Header from '../components/Header';
import fonts from '../utils/fonts';
import ModalPicker from '../components/ModalPicker';
import { getUnidadesDeRecaudacion } from '../services/configuracion';
import { ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { abrirCorte } from '../services/recaudacion';
import { dispatchSetCorte } from '../store/actions/user';
import ModalMessage from '../components/ModalMessage';

const AbrirCorteScreen = () => {
  // Component's state
  const [unidadesDeRecaudacion, setUnidadesDeRecaudacion] = useState([]);
  const [unidadDeRecaudacion, setUnidadDeRecaudacion] = useState();
  const [total, setTotal] = useState<string>('');
  const [showPicker, setShowPicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Effects
  useEffect(() => {
    fetchUnidades();
  }, []);

  // Handlers
  const fetchUnidades = async () => {
    setIsFetching(true);
    const response = await getUnidadesDeRecaudacion();
    setUnidadesDeRecaudacion(response);
    setIsFetching(false);
  }

  const pickerOptions = useMemo(() => {
    return unidadesDeRecaudacion.map(unidad => ({
      label: unidad.descripcion,
      value: unidad.id,
    }));
  }, [unidadesDeRecaudacion]);

  const onSelect = (option) => {
    const item = unidadesDeRecaudacion.find(unidad => unidad.id === option);
    setUnidadDeRecaudacion(item);
  };

  const onSubmit = () => {
    setIsLoading(true);

    // validate total
    const regexFloatOrInt = /^\d+(\.\d{1,2})?$/;

    if (!unidadDeRecaudacion || !regexFloatOrInt.test(total)) {
      setErrorMessage('Error de captura, verifique los datos');
      setIsLoading(false);
      return;
    }

    // @ts-ignore
    const response = abrirCorte(total, unidadDeRecaudacion.id);

    if (response) {
      dispatchSetCorte(response);
    }

    setIsLoading(false);
   };

  return (
    <>
      <Container>
        <Header title="Abrir Corte" />

        <KeyboardAwareScrollView
          contentContainerStyle={{padding: 20}}
        >
          <InputContainer>
            <Label>
              Unidad de recaudación
            </Label>

            <InputInnerContainer>
              <TouchableWithoutFeedback
                onPress={() => setShowPicker(true)}
                disabled={isFetching || isLoading}
              >
                <PickerDisplayValue
                  isPlaceholder={!unidadDeRecaudacion}
                >
                  {
                    unidadDeRecaudacion
                      // @ts-ignore
                      ? unidadDeRecaudacion.descripcion
                      : 'Seleccione una unidad de recaudación'
                  }
                </PickerDisplayValue>
              </TouchableWithoutFeedback>
            </InputInnerContainer>
          </InputContainer>

          <InputContainer>
            <Label>
              Total de fondo (Efectivo)
            </Label>

            <InputInnerContainer>
              <Input
                value={total}
                onChangeText={(value) => setTotal(value)}
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
              {
                isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ButtonText>
                    Abrir corte
                  </ButtonText>
                )
              }
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
  background-color: #EFF4F8;
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
  border: 1px solid #DCDCDC;
`;

const Input = styled.TextInput`
  padding-horizontal: 15px;
  width: 100%;
  color: #141414;
`;

const PickerDisplayValue = styled.Text<{ isPlaceholder?: boolean }>`
  padding-vertical: 10px;
  padding-horizontal: 15px;
  color: ${props => props.isPlaceholder ? '#aaaaaa' : '#141414'}
`;

const Button = styled.View`
  padding: 15px;
  background-color: #D2B15B;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #FFFFFF;
  font-size: 16px;
`;

export default AbrirCorteScreen;
