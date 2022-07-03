// External dependencies
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Interfaces & Types
interface IHeaderProps {
  title: string;
  isGoBack?: boolean;
  onPressLeftButton?: () => void;
  disableLeftButton?: boolean;
  noLeftButton?: boolean;
}

const Header = ({
  title,
  isGoBack,
  onPressLeftButton,
  disableLeftButton,
  noLeftButton,
}: IHeaderProps) => {
  return (
    <View style={styles.header}>
      {!noLeftButton ? (
        <TouchableWithoutFeedback
          onPress={onPressLeftButton}
          disabled={disableLeftButton}>
          <View style={styles.logoContainer}>
            <Icon
              style={styles.navIcon}
              name={!isGoBack ? 'bars' : 'chevron-left'}
              size={!isGoBack ? 30 : 25}
              color="white"
            />
          </View>
        </TouchableWithoutFeedback>
      ) : null}

      <View style={styles.textContainer}>
        <Text style={styles.tituloHeader}>{title}</Text>
      </View>
      <TouchableWithoutFeedback>
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
    marginBottom: 10,
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
    justifyContent: 'center',
    alignItems: 'center',
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
