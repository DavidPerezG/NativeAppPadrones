// External dependencies
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

// External dependencies
import Icon from 'react-native-vector-icons/Ionicons';
import fonts from '../../../utils/fonts';

interface ListItemProps {
  text: string;
  onPress: () => void;
  isSelected: boolean;
}

export const LIST_ITEM_HEIGHT = 50;

const ListItem: React.FC<ListItemProps> = ({
  text,
  onPress,
  isSelected,
}) => (
  <TouchableWithoutFeedback
    onPress={onPress}
  >
    <Container>
      <Text>
        { text }
      </Text>

      {
        isSelected && (
          <IconContainer>
            <Icon
              name="ios-checkmark"
              size={20}
              color="#000000"
            />
          </IconContainer>
        )
      }
    </Container>
  </TouchableWithoutFeedback>
);

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  height: ${LIST_ITEM_HEIGHT}px;
  width: 100%;
  padding-horizontal: 20px;
  align-items: center;
  justify-content: space-between;
`;

const Text = styled.Text`
  font-family: ${fonts.regular};
  color: #141414;
  font-size: 16px;
`;

const IconContainer = styled.View`
  height: ${LIST_ITEM_HEIGHT}px;
  width: ${LIST_ITEM_HEIGHT}px;
  justify-content: center;
  align-items: center;
`;

export default ListItem;
