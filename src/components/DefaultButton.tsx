// Dependencies
import React from 'react';
import {
  ViewPropTypes,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import propTypes from 'prop-types';
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

Button.propTypes = {
  text: propTypes.string,
  onPress: propTypes.func.isRequired,
  style: ViewPropTypes.style,
  textStyle: ViewPropTypes.style,
  disabled: propTypes.bool,
  loading: propTypes.bool,
};

Button.defaultProps = {
  text: undefined,
  style: {},
  textStyle: {},
  disabled: false,
  loading: false,
};

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
