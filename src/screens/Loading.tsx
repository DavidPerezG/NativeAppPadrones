// External dependencies
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

// Internal dependencies
import { getUserInfo } from '../services/user';
import { refreshToken } from '../services/http';
import { dispatchSetRefreshToken } from '../store/actions/auth';
import { dispatchSetUserInfo } from '../store/actions/user';

const LoadingScreen = () => {
  // Navigation
  const navigation = useNavigation();

  // Redux
  const dispatch = useDispatch();
  // @ts-ignore
  const isAuthenticated = useSelector(state => Boolean(state.auth.access));
  // @ts-ignore
  const refresh = useSelector(state => state.auth.refresh);

  useEffect(() => {
    setTimeout(() => {
      onLoad();
    }, 500);
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
        routes: [{
          // @ts-ignore
          name: 'login',
        }]
      });

      return;
    }

    const userInfo = await getUserInfo();

    if (userInfo) {
      dispatchSetUserInfo(dispatch, userInfo);

      navigation.reset({
        index: 0,
        routes: [{
          // @ts-ignore
          name: 'menu',
        }]
      });

      return;
    }

    navigation.reset({
      index: 0,
      routes: [{
        // @ts-ignore
        name: 'login',
      }]
    });
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#141414"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
