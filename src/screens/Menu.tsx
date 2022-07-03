// External dependencies
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

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
          color="#3F3F3F"
          navPage="cargosPadrones"
        />

        <MenuCard
          nombreItem="Abrir Corte"
          iconName="coins"
          color={!hasCorte ? activeColor : disableColor}
          navPage={!hasCorte ? 'abrir-corte' : undefined}
        />

        <MenuCard
          nombreItem="Cerrar Corte"
          iconName="window-close"
          color={hasCorte ? activeColor : disableColor}
          navPage={hasCorte ? 'detalle-de-corte' : undefined}
        />
      </View>
      <View style={styles.row}>
        <MenuCard
          nombreItem="Padrones"
          iconName="address-book"
          color="#3F3F3F"
          navPage="listado-padrones"
        />
        <MenuCard
          nombreItem="Mi
          Perfil"
          iconName="user-alt"
          color="#3F3F3F"
          navPage="profile"
        />
        <MenuCard
          nombreItem="Cerrar Sesión"
          iconName="door-open"
          color="#3F3F3F"
          navPage="login"
        />
        {/* <MenuCard isBlank={true} /> */}
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
