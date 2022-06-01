import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {ActivityIndicator, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Pdf from 'react-native-pdf';

import fonts from '../utils/fonts';

import Header from '../components/Header';
import Button from '../components/DefaultButton';
import http from '../services/http';

// Interfaces & Types
interface IPreviewPDFProps {}

const PreviewPDF = ({route}) => {
  const [base64, setBase64] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (route.params.base64) {
      setBase64(route.params.base64);
    }
  }, []);

  return (
    <>
      <Header
        isGoBack
        onPressLeftButton={navigation.goBack}
        title="Previewer"
      />
      {/* <Button text="Enviar a Correo" />
      <Button text="Enviar a MiCuentaMX" /> */}
      <Center>
        {isLoading ? (
          <ActivityIndicator color={'gray'} size={'large'} />
        ) : (
          <Pdf
            source={{uri: base64}}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height * 0.5,
            }}
          />
        )}
      </Center>
    </>
  );
};

export default PreviewPDF;

const Container = styled.View`
  flex: 1;
  background-color: #eff4f8;
`;

const MainContainer = styled.View`
  margin-horizontal: 20px;
`;

const Center = styled.View`
  flex: 1;
  justify-content: center;
`;
