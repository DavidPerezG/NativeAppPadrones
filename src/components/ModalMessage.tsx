// External dependencies
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Modal} from 'react-native';

// Types & Interfaces
interface ModalMessageProps {
  message: string;
  clearMessage: () => void;
}

const ModalMessage = ({message, clearMessage}: ModalMessageProps) => {
  // Component's state
  const [isOpen, setIsOpen] = useState(false);

  // Effects
  useEffect(() => {
    if (message && !isOpen) {
      setIsOpen(true);
    }
  }, [message, isOpen]);

  // Handlers
  const onClose = () => {
    setIsOpen(false);
    clearMessage();
  };

  return (
    <Modal visible={isOpen} transparent onRequestClose={onClose}>
      <View style={styles.centeredModal}>
        <View style={styles.modal}>
          <Text style={styles.message}>{message}</Text>
          <Pressable style={styles.modalButton} onPress={onClose}>
            <Text style={styles.buttonText}>Entendido</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  modal: {
    backgroundColor: 'white',
    width: 300,
    alignItems: 'center',
    borderRadius: 10,
  },
  modalButton: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    width: 300,
  },
  message: {
    margin: 20,
    fontSize: 15,
    color: 'black',
  },
  buttonText: {
    color: '#000000',
  },
});

export default ModalMessage;
