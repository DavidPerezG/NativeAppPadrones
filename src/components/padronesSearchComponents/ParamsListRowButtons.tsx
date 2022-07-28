// External dependencies
import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  NativeModules,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fonts from '../../utils/fonts';

// Internal dependencies

// Services

// Types
interface IParamsListRowButtons {
  onDownPressed: () => void;
  onParamPressed: () => void;
  onUpPressed: () => void;
  labelText: string;
  sortingByState: string;
}

const ParamsListRowButtons = ({
  onDownPressed,
  onParamPressed,
  onUpPressed,
  labelText,
  sortingByState,
}: IParamsListRowButtons) => {
  return (
    <ParamsRowButtons>
      <TouchableWithoutFeedback onPress={onDownPressed}>
        <ArrowDownButton
          style={
            sortingByState === 'descending'
              ? {backgroundColor: '#841f36'}
              : {backgroundColor: 'white'}
          }>
          <FontAwesome5
            name={'chevron-down'}
            size={19}
            solid
            color={sortingByState === 'descending' ? '#fff' : '#841F36'}
          />
        </ArrowDownButton>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onParamPressed}>
        <AddButton>
          <Label>{labelText}</Label>
        </AddButton>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onUpPressed}>
        <ArrowUpButton
          style={
            sortingByState === 'ascending'
              ? {backgroundColor: '#841f36'}
              : {backgroundColor: 'white'}
          }>
          <FontAwesome5
            name={'chevron-up'}
            size={19}
            solid
            color={sortingByState === 'ascending' ? '#fff' : '#841F36'}
          />
        </ArrowUpButton>
      </TouchableWithoutFeedback>
    </ParamsRowButtons>
  );
};

const ParamsRowButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ArrowUpButton = styled.View`
  height: 50px;
  justify-content: center;
  align-items: center;
  width: 12.5%;
  border-color: #841f36;
  border-width: 1px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const ArrowDownButton = styled.View`
  height: 50px;
  justify-content: center;
  align-items: center;
  width: 12.5%;
  border-color: #841f36;
  border-width: 1px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-right-width: 0px;
`;

const AddButton = styled.View`
  width: 75%;
  height: 50px;
  background-color: #ffffff;
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

export default ParamsListRowButtons;
