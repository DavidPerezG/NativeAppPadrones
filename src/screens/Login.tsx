// External dependencies
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from 'react-redux';

// Internal dependencies
import { login } from '../services/auth';
import { dispatchClearAuth, dispatchLogin } from '../store/actions/auth';

const Login = () => {
  // Component's state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Redux
  const dispatch = useDispatch();

  // Navigation
  const navigation = useNavigation();

  // Effects
  useEffect(() => {
    dispatchClearAuth(dispatch);
  }, []);

  /**
   * Handle the login button press
   */
  const onPressLoginHandle = async () => {
    setLoading(true);

    // Sanitaze inputs
    const emailSanitized = email.replace(/\s/g, '');

    // Validate inputs
    if (!emailSanitized || !password) {
      setModalMessage('Los campos no deben estar en blanco');
      setModalVisibility(true);
      setLoading(false);
      return;
    }

    const loginResponse = await login(emailSanitized, password);
    console.log("este es el log " + loginResponse);

    if (loginResponse === null) {
      setLoading(false);
    } else {

      if (Object.prototype.hasOwnProperty.call(loginResponse, 'access')) {
        dispatchLogin(dispatch, loginResponse);

        navigation.reset({
          index: 0,
          routes: [{
            // @ts-ignore
            name: 'loading',
          }],
        });
        return;
      }

      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Image source={require('../../assets/imagenes/logo.png')} />
        <Text style={styles.welcomeText}>Bienvenido</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Correo</Text>
          <View style={styles.inputSpace}>
            <Icon
              style={styles.icons}
              name="envelope"
              size={16}
              color="gray"
              onPress={() => setSecure(!secure)}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Contraseña</Text>
          <View style={styles.inputSpace}>
            <Icon
              style={styles.icons}
              name="lock"
              size={16}
              color="gray"
              onPress={() => setSecure(!secure)}
            />
            <TextInput
              style={styles.input}
              autoCorrect={false}
              secureTextEntry={secure}
              placeholder="Contraseña"
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <Icon
              style={styles.iconsEye}
              name={secure ? 'eye' : 'eye-slash'}
              size={16}
              color="gray"
              onPress={() => setSecure(!secure)}
            />
          </View>
        </View>

        <Text style={styles.olvidoText}>¿Olvidó su contraseña?</Text>

        <Pressable
          onPress={onPressLoginHandle}
          style={styles.button}
          android_ripple={{ color: 'green' }}
          disabled={loading}>
          {
            loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.iniciarText}>Iniciar Sesión</Text>
              )
          }
        </Pressable>
      </View>

      <Modal
        visible={modalVisibility}
        transparent
        onRequestClose={() => {
          setModalVisibility(false);
        }}>
        <View style={styles.centeredModal}>
          <View style={styles.modal}>
            <Text style={styles.message}>{modalMessage}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisibility(false);
              }}>
              <Text style={{ color: 'black' }}>Entendido</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#808080',
    fontWeight: 'bold',
    fontSize: 30,
    marginVertical: 30,
  },
  inputTitle: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  input: {
    color: 'black',
    backgroundColor: 'white',
    padding: 5,
    paddingLeft: 30,
    marginBottom: 20,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 5,
    flex: 1,
  },
  inputContainer: {
    width: 250,
    height: 70,
  },
  inputSpace: {
    flexDirection: 'row',
    borderColor: '#000',
    paddingBottom: 10,
  },
  icons: {
    position: 'absolute',
    zIndex: 1,
    top: 11,
    left: 7,
  },
  iconsEye: {
    position: 'absolute',
    top: 12,
    right: 10,
  },
  olvidoText: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#D2B15B',
    padding: 10,
    paddingHorizontal: 70,
    borderRadius: 50,
    minWidth: 200,
  },
  iniciarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  centeredModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000080',
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
});
