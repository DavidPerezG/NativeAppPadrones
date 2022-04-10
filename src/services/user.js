// Internal dependencies
import {HTTP} from './http';

const getUserInfo = async () => {
  try {
    const response = await HTTP.get('usuarios/id/');

    return response?.data;
  } catch (error) {
    console.error(error, error?.response?.data?.detail);
  }

  return null;
};

export {getUserInfo};
