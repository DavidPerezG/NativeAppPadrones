import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';

import {useNavigation} from '@react-navigation/native';

import Header from '../components/Header';
import MenuCard from '../components/MenuCard';

const Menu = props => {
  const navigation = useNavigation();

  useEffect(() => {
    if (global.token === '') {
      navigation.reset({
        index: 0,
        routes: [{name: 'login'}],
      });
    }
  }, []);

  return (
    <View>
      <Header title="Menú" />
      <View style={styles.row}>
        <MenuCard
          nombreItem="Caja"
          iconName="cash-register"
          col="#3F3F3F"
          navPage="caja"
        />
        <MenuCard nombreItem="Abrir Corte" iconName="coins" col="#3F3F3F" />
        <MenuCard
          nombreItem="Cerrar Corte"
          iconName="window-close"
          col="#3F3F3F"
        />
      </View>
      <View style={styles.row}>
        <MenuCard nombreItem="Mi Perfil" iconName="user-alt" col="#3F3F3F" />
        <MenuCard
          nombreItem="Cerrar Sesión"
          iconName="door-open"
          col="#3F3F3F"
          navPage="login"
        />
        <MenuCard isBlank={true} />
      </View>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 15,
  },
});
