// External dependencies
import {
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

// Internal dependencies
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';

const Menu = () => {
  // Redux
  // @ts-ignore
  const hasCorte = useSelector(state => Boolean(state.user.corte));

  // Build data
  const activeColor = '#3F3F3F';
  const disableColor = '#aaaaaa';

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

        <MenuCard
          nombreItem="Abrir Corte"
          iconName="coins"
          col={!hasCorte ? activeColor : disableColor}
          navPage="abrir-corte"
        />

        <MenuCard
          nombreItem="Cerrar Corte"
          iconName="window-close"
          col={hasCorte ? activeColor : disableColor}
        />
      </View>
      <View style={styles.row}>
        <MenuCard
          nombreItem="Mi
          Perfil"
          iconName="user-alt"
          col="#3F3F3F"
          navPage="profile"
        />
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
