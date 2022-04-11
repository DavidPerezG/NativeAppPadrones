// Internal dependencies
import {HTTP} from './http';

const getUnidadesDeRecaudacion = async () => {
  try {
    const response = await HTTP.get('configuracion/unidades-de-recaudacion/');

    if (Array.isArray(response?.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error, error?.response?.data?.detail);
  }

  return [];
};

const getMetodosDePago = async () => {
  try {
    const response = await HTTP.get(
      'configuracion/catalogos-de-metodos-de-pagos/',
    );
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error, error?.response?.data?.detail);
  }
  return [];
};

export {getUnidadesDeRecaudacion, getMetodosDePago};
