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
    imprimirObligaciones();
  }, []);

  const imprimirObligaciones = async () => {
    try {
      setIsLoading(true);
      const response = await http.post(
        '/cuentaunicasir/opinion-de-las-obligaciones/pdf/',
        {
          padron_id: route.params.padron_id,
          tipo_de_padron: route.params.tipo_de_padron,
        },
      );
      if (response?.status === 200) {
        setBase64(`data:application/pdf;base64,${response.data.data}`);
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header
        isGoBack
        onPressLeftButton={navigation.goBack}
        title="Previewer"
      />
      <Center>
        {isLoading ? (
          <ActivityIndicator color={'gray'} size={'large'} />
        ) : (
          <Pdf
            source={{uri: base64}}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
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
