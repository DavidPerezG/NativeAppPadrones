import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

import {getBase64Recibos, getBase64Ticket} from '../services/cajaPdf';

import fonts from '../utils/fonts';

import Header from '../components/Header';
import Button from '../components/DefaultButton';

const DatosTabla = [
  {
    title: 'Folio',
    parameter: '',
  },
  {
    title: 'Folio de Facturación',
    parameter: '',
  },
  {
    title: 'Fecha',
    parameter: '',
  },
  {
    title: 'Padrón',
    parameter: '',
  },
  {
    title: 'Tipo de Padrón',
    parameter: '',
  },
  {
    title: 'Importe',
    parameter: '',
  },
];
// Interfaces & Types
interface IRecibosDeCajaProps {}

const RecibosDeCaja = ({route}) => {
  const [recibos, setRecibos] = useState();
  const [loadingRecibo, setLoadingRecibo] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    setRecibos(route.params?.recibos);
  }, []);

  const getRecibo = async () => {
    setLoadingRecibo(true);
    const base64 = await getBase64Recibos(recibos?.recibos?.[0].id);
    navigation.navigate('preview-pdf', {base64});
    setLoadingRecibo(false);
  };

  const getTicket = async () => {
    setLoadingTicket(true);
    const base64 = await getBase64Ticket(recibos?.recibos?.[0].id);
    navigation.navigate('preview-pdf', {base64});
    setLoadingRecibo(false);
  };

  return (
    <Container>
      <Header title="Recibos" isGoBack onPressLeftButton={navigation.goBack} />
      <MainContainer>
        <Button
          loading={loadingRecibo}
          text="Ver Recibo"
          style={{marginBottom: 10}}
          onPress={() => getRecibo()}
        />
        <Button
          loading={loadingTicket}
          text="Imprimir Ticket"
          style={{marginBottom: 10}}
          onPress={() => getTicket()}
        />
        {/* <Button text="Facturar" style={{marginBottom: 10}} /> */}

        <FlatList
          data={DatosTabla}
          renderItem={({item, index}) => (
            <Row>
              <DataLabel>{item.title}:</DataLabel>
              <View style={{flex: 1}}>
                <TextLeft>{item.parameter}</TextLeft>
              </View>
            </Row>
          )}
        />
      </MainContainer>
    </Container>
  );
};

export default RecibosDeCaja;

const Container = styled.View`
  flex: 1;
  background-color: #eff4f8;
`;

const MainContainer = styled.View`
  margin-horizontal: 20px;
`;

const Row = styled.View`
  align-items: center;
  height: 50px;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const TextLeft = styled.Text`
  color: black;
  font-family: ${fonts.light};
  text-align: right;
`;

const DataLabel = styled.Text`
  font-family: ${fonts.bold};
  font-weight: bold;
  color: #353535;
  font-size: 15px;
`;
