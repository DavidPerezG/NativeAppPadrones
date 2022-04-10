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

export {getUnidadesDeRecaudacion};
