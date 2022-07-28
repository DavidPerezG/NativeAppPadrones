// External dependencies
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

// Internal dependencies
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import {refreshToken} from '../services/http';
import {dispatchSetRefreshToken} from '../store/actions/auth';
import {dispatchSetUserInfo} from '../store/actions/user';
import {getUserInfo} from '../services/user';

const Menu = () => {
  const navigation = useNavigation();

  // Redux
  const dispatch = useDispatch();
  // @ts-ignore
  const hasCorte = useSelector(state => Boolean(state.user.corte));

  const isAuthenticated = useSelector(state => Boolean(state.auth.access));
  const refresh = useSelector(state => state.auth.refresh);

  // Build data
  const activeColor = '#3F3F3F';
  const disableColor = '#aaaaaa';

  useEffect(() => {
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Handlers
  const onLoad = async () => {
    if (!isAuthenticated) {
      // If there is not access token, then we need to get it
      if (refresh) {
        const newToken = await refreshToken(refresh);

        if (newToken) {
          // @ts-ignore
          dispatchSetRefreshToken(dispatch, newToken);

          return;
        }
      }

      navigation.reset({
        index: 0,
        routes: [
          {
            // @ts-ignore
            name: 'login',
          },
        ],
      });

      return;
    }

    const userInfo = await getUserInfo();
    console.log(userInfo.corte);

    if (userInfo) {
      dispatchSetUserInfo(dispatch, userInfo);

      return;
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          // @ts-ignore
          name: 'login',
        },
      ],
    });
  };

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
