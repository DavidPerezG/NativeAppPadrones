// Dependencies
import React from 'react';
import {TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';

export default function Button({
  text,
  onPress,
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
          <Text style={textStyle}>{text}</Text>
        )}
      </Container>
    </TouchableWithoutFeedback>
  );
}

const Container = styled.View`
  width: 100%;
  height: 50px;
  background-color: #235161;
  border-radius: 10px;
  padding: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Text = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;
