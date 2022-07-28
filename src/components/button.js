// Dependencies
import React from 'react';
import {TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';

import {primaryColor} from '../utils/colors';

export default function Button({
  text,
  onPress,
  children,
  style,
  textStyle,
  disabled,
  loading,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress} disabled={disabled || loading}>
      <Container style={style}>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          children || <Text style={textStyle}>{text}</Text>
        )}
      </Container>
    </TouchableWithoutFeedback>
  );
}

Button.defaultProps = {
  text: undefined,
  style: {},
  textStyle: {},
  disabled: false,
  loading: false,
};

const Container = styled.View`
  height: 55px;
  background-color: ${primaryColor};
  border-radius: 25px;
  padding-horizontal: 20px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const Text = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;
