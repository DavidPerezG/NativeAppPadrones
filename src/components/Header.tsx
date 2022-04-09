import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React from 'react';

import Icon from 'react-native-vector-icons/FontAwesome5';

const Header = ({title}) => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Icon style={styles.navIcon} name="bars" size={30} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.tituloHeader}>{title}</Text>
      </View>
      <TouchableWithoutFeedback
        onPress={() => console.log('hola me presionaste aaa')}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.notifContainer}
            source={require('../../assets/imagenes/notificationGet_icon.png')}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 64,
    width: '100%',
    backgroundColor: '#235161',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomEndRadius: 15,
    borderBottomLeftRadius: 15,
    padding: 20,
    marginBottom: 14,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tituloHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoContainer: {
    height: 41,
    width: 41,
    borderRadius: 10,
  },
  notifContainer: {
    height: 35,
    width: 35,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  navIcon: {
    marginTop: 2,
    textAlign: 'center',
  },
});
