import React from 'react';
import {ScrollView} from 'react-native';
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
}) => {
  return (
    <StyledModal isVisible={isVisible}>
      <Container>
        <Header title={title} onClose={onClose} />

        <ScrollView>
          {options.map((item, index) => (
            <>
              <ListItem
                key={item.label.toString()}
                text={item.label}
                isSelected={item.value === value}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              />

              {index < options.length - 1 && <Separator />}
            </>
          ))}
        </ScrollView>
      </Container>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  padding: 0;
  margin: 0;
`;

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
