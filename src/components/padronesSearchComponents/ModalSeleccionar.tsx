import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
} from 'react-native';
import styled from 'styled-components/native';

import {Option} from '../../types/option';
import fonts from '../../utils/fonts';

interface IModalSeleccionar {
  headerText?: string;
  isOpen: boolean;
  options: Array<Option>;
  onSelect: (selectedOption: Option) => void;
  onRequestClose: () => void;
  onCloseButtonPressed: () => void;
  closeButton?: boolean;
}

const ModalSeleccionar = ({
  headerText,
  isOpen,
  options,
  onSelect,
  onRequestClose,
  onCloseButtonPressed,
  closeButton,
}: IModalSeleccionar) => {
  const _renderOption = ({item, index}) => (
    <TouchableWithoutFeedback onPress={() => onSelect(item)}>
      <ButtonOption>
        <TextOption>{item.label}</TextOption>
      </ButtonOption>
    </TouchableWithoutFeedback>
  );

  return (
    <Modal visible={isOpen} transparent onRequestClose={onRequestClose}>
      <BehindModal>
        <ModalView>
          {headerText ? <TextHeader>{headerText}</TextHeader> : null}
          <FlatList
            data={options}
            renderItem={_renderOption}
            keyExtractor={(item, index) => index.toString()}
          />
          {closeButton ? (
            <TouchableWithoutFeedback onPress={onCloseButtonPressed}>
              <ButtonClose>
                <TextClose>Cerrar</TextClose>
              </ButtonClose>
            </TouchableWithoutFeedback>
          ) : null}
        </ModalView>
      </BehindModal>
    </Modal>
  );
};

export default ModalSeleccionar;

const TextHeader = styled.Text`
  color: black;
  font-family: ${fonts.bold};
  font-size: 20px;
  padding-bottom: 5px;
`;

const TextOption = styled.Text`
  color: black;
  padding: 5px;
  font-family: ${fonts.bold};
  text-align: center;
`;

const TextClose = styled.Text`
  color: white;
  padding: 5px;
  font-family: ${fonts.bold};
  text-align: center;
`;

const BehindModal = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #00000080;
`;

const ModalView = styled.View`
  background-color: white;
  max-height: ${Dimensions.get('window').height * 0.5};
  width: ${Dimensions.get('window').width * 0.9};
  align-items: center;
  border-radius: 10px;
  padding-vertical: 10px;
`;

const ButtonOption = styled.View`
  background-color: white;
  width: ${Dimensions.get('window').width * 0.85};
  border-radius: 10px;
  border-width: 0.5px;
  margin-vertical: 2px;
  padding-vertical: 5px;
`;

const ButtonClose = styled.View`
  background-color: #79142a;
  width: ${Dimensions.get('window').width * 0.85};
  border-radius: 10px;
  border-color: gray;
  border-width: 0.6px;
  margin-vertical: 10px;
  padding-vertical: 10px;
`;

const Label = styled.View`
  color: black;
  font-family: ${fonts.light};
  margin-left: 17;
`;
