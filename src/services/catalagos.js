import {HTTP} from './http';

const getPadrones = async () => {
  try {
    const response = await HTTP.get('catalogos/content-types-padrones/');
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.error(error, error?.response?.data?.detail);
  }
  return [];
};

export {getPadrones};
