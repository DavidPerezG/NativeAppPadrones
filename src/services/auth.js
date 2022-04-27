// Internal dependencies
import {HTTP} from './http';

const login = async (email, password) => {
  try {
    const response = await HTTP.post('usuarios/login/', {
      email,
      password,
    });
    console.log('La respuesta de login');
    console.log(response?.data);
    return response?.data?.access ? response?.data : null;
  } catch (error) {
    console.error(error, error?.response?.data);
  }
  return null;
};

export {login};
