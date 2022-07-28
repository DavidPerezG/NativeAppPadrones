// Internal dependencies
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch} from 'react-redux';

// External dependencies
import {dispatchClearAuth} from '../store/actions/auth';
import {useNotification} from './DropdownalertProvider';
import {DropdownAlertType} from 'react-native-dropdownalert';

interface IMenuCard {
  isBlank?: boolean;
  unable?: boolean;
  navPage?: string;
  nombreItem?: string;
  style?: object;
  iconName?: string;
  color?: string;
}

const MenuCard = ({
  isBlank,
  unable,
  navPage,
  nombreItem,
  style,
  iconName,
  color,
}: IMenuCard) => {
  // Navigation
  const navigation = useNavigation();

  // Redux
  const dispatch = useDispatch();

  const notify = useNotification();

  const showAlert = (
    mensaje?: string,
    titulo?: string,
    type?: DropdownAlertType,
  ) =>
    notify({
      type: type || 'error',
      title: titulo || 'Problema en la busqueda',
      message: mensaje || '',
    });

  const handleClick = () => {
    if (unable === true) {
      showAlert(
        'Disculpa la molestia',
        'Funcionalidad en Mantenimiento',
        'info',
      );
    } else {
      if (navPage === 'cargosPadrones') {
        global.padronSeleccionado = nombreItem;
        navigation.navigate('cargosPadrones', {padronNombre: nombreItem});
        return null;
      }

      if (navPage === 'login') {
        dispatchClearAuth(dispatch);

        navigation.reset({
          index: 0,
          // @ts-ignore
          routes: [{name: navPage}],
        });
      } else {
        // @ts-ignore
        navPage ? navigation.navigate(navPage) : false;
      }
    }
  };

  if (isBlank) {
    return <View style={{...styles.squareStyleBlank, ...style}} />;
  }

  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View style={{...styles.squareStyle, ...style}}>
        <FontAwesome5
          name={iconName}
          size={40}
          styles={styles.iconContainer}
          solid
          color={color}
        />
        <Text style={[styles.text, {color: color}]}>{nombreItem}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  squareStyle: {
    borderRadius: 5,
    width: 110,
    height: 120,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 7,
    shadowOpacity: 0.09,
    elevation: 5,
    margin: 3,
  },
  squareStyleBlank: {
    borderRadius: 5,
    width: 115,
    height: 120,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    marginHorizontal: 0,
  },
  iconContainer: {
    margin: 5,
  },
  text: {
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
    color: '#3F3F3F',
  },
});

export default MenuCard;
