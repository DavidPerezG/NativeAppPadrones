// External dependencies
import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

// Internal dependencies
import fonts from '../../../utils/fonts';

interface HeaderProps {
  onClose: () => void;
  disabled?: boolean;
  title: string;
}

export const HEADER_HEIGHT = 55;

const Header: React.FC<HeaderProps> = ({onClose, disabled, title}) => {
  const insets = useSafeAreaInsets();

  return (
    <Container
      style={{
        paddingTop: insets.top,
      }}>
      <InnerContainer>
        <TouchableWithoutFeedback onPress={onClose} disabled={disabled}>
          <IconContainer />
        </TouchableWithoutFeedback>

        <TitleContainer>
          <Title numberOfLines={1}>{title}</Title>
        </TitleContainer>
      </InnerContainer>
    </Container>
  );
};

Header.defaultProps = {
  disabled: false,
};

const Container = styled.View`
  width: 100%;
`;

const InnerContainer = styled.View`
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #e6e6e6;
`;

const IconContainer = styled.View`
  width: ${HEADER_HEIGHT}px;
  height: ${HEADER_HEIGHT}px;
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-family: ${fonts.bold};
  color: #000000;
`;

export default Header;
