import {HTTP} from './http';

const getMunicipios = async () => {
  try {
    const response = await HTTP.get('catalogos/entidades-municipales/');
    return response?.data ?? [];
  } catch (error) {
    console.error(error);
  }
  return [];
};

export {getMunicipios};
