import {Ciudadano} from '../../types/ciudadanoInterface';
import http from '../http';

const urlEndpoint = 'cuentaunicasir/ciudadanos';

const getCiudadanos = async (
  formData?: Ciudadano,
  page?: number,
): Promise<Array<Ciudadano>> => {
  let result;
  await http
    .get(urlEndpoint, {
      params: {
        clave_ciudadana: formData?.clave_ciudadana,
        email: formData?.email,
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        second_last_name: formData?.second_last_name,
        page: page,
      },
    })
    .then(
      response => {
        result = response.data;
      },
      error => {
        console.error(error);
      },
    );
  return result;
};

const deleteCiudadano = async (id: number) => {
  let result;
  await http.delete(urlEndpoint + id).then(
    response => {
      result = response.data;
    },
    error => {
      console.error(error);
    },
  );
  return result;
};

export {getCiudadanos, deleteCiudadano};
