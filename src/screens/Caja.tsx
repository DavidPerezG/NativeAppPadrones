import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  AsyncStorage,
} from 'react-native';

import axios from 'axios';

import Icon from 'react-native-vector-icons/FontAwesome5';

const Caja = () => {
  const navigation = useNavigation();

  useEffect(() => {
    if (global.token === '') {
      navigation.reset({
        index: 0,
        routes: [{name: 'login'}],
      });
    }
  }, []);

  return <Text>CAJA WORKS</Text>;
};

export default Caja;
