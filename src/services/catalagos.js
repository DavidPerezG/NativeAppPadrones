import {HTTP} from './http';

const getPadrones = async () => {
  let result;
  try {
    const response = await HTTP.get('catalogos/content-types-padrones/');
    result = response.data;
  } catch (error) {
    console.error(error, error?.response?.data?.detail);
  }

  return result;
};

const getContribuyentes = async () => {
  try {
    const response = await HTTP.get('cuentaunicasir/ciudadano-caja/?q=1');
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error, error?.response?.data?.detail);
  }
  return [];
};

export {getPadrones, getContribuyentes};
