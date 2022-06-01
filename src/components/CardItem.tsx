import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import fonts from '../utils/fonts';

const CardItem = ({
  navegar,
  info,
  selectType,
  data,
  padron,
  cargo,
  reduceCargo,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate(navegar, {
          selectType: selectType,
          data: data,
          nombrePadron: padron,
          cargo: cargo,
        })
      }>
      <Container>
        <Label>
          {info < 35 ? info : `${info?.substring(0, 32)}...`}
          {reduceCargo ? reduceCargo?.adeudo_total : null}
        </Label>
        <FontAwesome5
          name={'chevron-right'}
          size={19}
          solid
          color={'#141414'}
        />
      </Container>
    </TouchableWithoutFeedback>
  );
};

const Container = styled.View`
  background-color: #ffffff;
  flex-direction: row;
  height: 53px;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 1px;
  elevation: 5;
  margin-vertical: 5px;
`;

const Label = styled.Text`
  font-family: ${fonts.light};
  font-weight: normal;
  color: #141414;
  font-size: 12px;
  flex: 1;
`;
export default CardItem;
