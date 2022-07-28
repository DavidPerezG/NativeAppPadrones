// External dependencies
import React, {useMemo, useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';

// Internal dependencies
import {RootStackParamList} from '../types/navigation';
import fonts from '../utils/fonts';
import ModalMessage from '../components/ModalMessage';
import Header from '../components/Header';
import {cerrarCorte, TMetodosDePagoProps} from '../services/recaudacion';
import {getMetodosDePago} from '../services/configuracion';
import {dispatchSetCorte} from '../store/actions/user';
import {getUserInfo} from '../services/user';
import {dispatchSetUserInfo} from '../store/actions/user';

// Interfaces & Types
type DetalleDeCorteScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'abrir-corte'
>;

const DetalleDeCorteScreen = () => {
  // Component's state
  const [totalCredito, setTotalCredito] = useState<string>('');
  const [totalDebito, setTotalDebito] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [metodosDePago, setMetodosDePago] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // Navigation
  const navigation = useNavigation<DetalleDeCorteScreenNavigationProps>();

  // Redux
  // @ts-ignore
  const corte = useSelector(state => state.user.corte);
  const dispatch = useDispatch();

  // Handlers
  const parseNumber = (number: string) => {
    const parsedNumber = parseFloat(number);

    if (isNaN(parsedNumber) || parsedNumber < 0) {
      return 0;
    }

    return parsedNumber;
  };

  const setUserInfo = async () => {
    const userInfo = await getUserInfo();

    if (userInfo) {
      dispatchSetUserInfo(dispatch, userInfo);

      return;
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    const regexpIsFloatOrInt = /^[0-9]*\.?[0-9]*$/;

    if (!regexpIsFloatOrInt.test(totalCredito)) {
      setErrorMessage('Error de formato en el total de crédito');
      setLoading(false);
      return;
    }

    if (!regexpIsFloatOrInt.test(totalDebito)) {
      setErrorMessage('Error de formato en el total de débito');
      setLoading(false);
      return;
    }

    if (!corte) {
      setErrorMessage('El usuario no tiene un corte abierto');
      setLoading(false);
      return;
    }

    const paymentMethods: TMetodosDePagoProps[] = [
      {
        importe: totalCredito,
        metodo_de_pago: idCredito,
      },
      {
        importe: totalCredito,
        metodo_de_pago: idDebito,
      },
    ];
    const isClosed = await cerrarCorte(corte.id, paymentMethods);
    setUserInfo();
    console.log('isClosed');
    console.log(isClosed);
    if (isClosed) {
      dispatchSetCorte(dispatch, null);
      navigation.goBack();
      return;
    }

    setErrorMessage('Error al cerrar el corte');
    setLoading(false);
  };

  const fetchData = async () => {
    setIsFetching(true);
    const response = await getMetodosDePago();
    setMetodosDePago(response);
    setIsFetching(false);
  };

  // Calculate totals
  const total = useMemo(() => {
    const totalCreditoNumber = parseNumber(totalCredito);
    const totalDebitoNumber = parseNumber(totalDebito);

    return (totalCreditoNumber + totalDebitoNumber).toFixed(2);
  }, [totalCredito, totalDebito]);

  const idCredito = useMemo(() => {
    return metodosDePago.find(item => item.clave === '04')?.id;
  }, [metodosDePago]);

  const idDebito = useMemo(() => {
    return metodosDePago.find(item => item.clave === '28')?.id;
  }, [metodosDePago]);

  // Effects
  useEffect(() => {
    fetchData();
    return () => {
      console.log('hola');
    };
  }, []);
  return (
    <>
      <Container>
        <Header
          title="Cerrar corte"
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
          disableLeftButton={loading}
        />

        <InnerContainer>
          <Title>Métodos de pago</Title>
          <HR />

          <FormItem>
            <Label>Tarjeta de crédito</Label>

            <Input
              placeholder="Ingrese el total recaudado"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              value={totalCredito}
              onChangeText={setTotalCredito}
              editable={!loading && idCredito && idDebito && !isFetching}
            />
          </FormItem>

          <HR />
          <FormItem>
            <Label>Tarjeta de débito</Label>

            <Input
              placeholder="Ingrese el total recaudado"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              value={totalDebito}
              onChangeText={setTotalDebito}
              editable={!loading && idCredito && idDebito && !isFetching}
            />
          </FormItem>
        </InnerContainer>

        <FormContainer>
          <TotalContainer>
            <TotalLabel>TOTAL:</TotalLabel>
            <TotalValue>${total}</TotalValue>
          </TotalContainer>

          <TouchableWithoutFeedback
            onPress={onSubmit}
            disabled={loading || !idCredito || !idDebito || isFetching}>
            <SubmitButton
              disabled={loading || !idCredito || !idDebito || isFetching}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <SubmitButtonText>Cerrar Corte</SubmitButtonText>
              )}
            </SubmitButton>
          </TouchableWithoutFeedback>
        </FormContainer>
      </Container>

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

const InnerContainer = styled(KeyboardAwareScrollView).attrs({
  contentContainerStyle: {
    paddingHorizontal: 20,
  },
})`
  flex: 1;
`;

const HR = styled.View`
  height: 1px;
  background-color: #e6e6e6;
  margin-vertical: 20px;
`;

const Title = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #141414;
  font-size: 24px;
  margin-top: 10px;
`;

const FormContainer = styled.View`
  width: 100%;
  background-color: #ffff;
  padding: 20px;
`;

const TotalContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const TotalLabel = styled.Text`
  color: #141414;
  font-family: ${fonts.bold};
  font-weight: 700;
  font-size: 16px;
`;

const TotalValue = styled.Text`
  color: #141414;
  font-family: ${fonts.regular};
  font-weight: 600;
  font-size: 16px;
`;

const SubmitButton = styled.View<{disabled?: boolean}>`
  font-family: ${fonts.semiBold};
  font-weight: 600;
  color: #903d4d;
  background-color: ${props => (props.disabled ? '#00a680' : '#235161')};
  height: 50px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 20px;
  border-radius: 5px;
`;

const SubmitButtonText = styled.Text`
  color: #ffff;
  font-family: ${fonts.bold};
  font-weight: 700;
  font-size: 16px;
`;

const FormItem = styled.View`
  width: 100%;
  margin-top: 10px;
`;

const Label = styled.Text`
  color: #141414;
  font-family: ${fonts.semiBold};
  font-weight: 600;
  margin-bottom: 5px;
`;

const Input = styled.TextInput`
  color: #141414;
  font-family: ${fonts.regular};
  font-size: 16px;
  border-radius: 5px;
  border-width: 1px;
  border-color: #e6e6e6;
  background-color: #fff;
  padding-horizontal: 10px;
`;

export default DetalleDeCorteScreen;
