import React from 'react';
import {
  FlatList,
} from 'react-native';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import Header from './components/Header';
import ListItem from './components/ListItem';

interface ModalPickerProps<T = unknown> {
  title: string;
  isVisible: boolean;
  value: T;
  onClose: () => void;
  onSelect: (value: T) => void;
  options: ReadonlyArray<{
    label: string;
    value: T;
  }>;
}

const ModalPicker: React.FC<ModalPickerProps> = ({
  title,
  isVisible,
  value,
  onSelect,
  onClose,
  options,
}) => (
  <Modal
    isVisible={isVisible}
    style={{
      padding: 0,
      margin: 0,
    }}
  >
    <Container>

      <Header title={title} onClose={onClose} />

      <FlatList
        data={options}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({ item }) => (
          <ListItem
            text={item.label}
            isSelected={item.value === value}
            onPress={() => {
              onSelect(item.value);
              onClose();
            }}
          />
        )}
      />
    </Container>
  </Modal>
);

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Separator = styled.View`
  height: 1px;
  background-color: #ebebeb;
  width: 100%;
`;

export default ModalPicker;
