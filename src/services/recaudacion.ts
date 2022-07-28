// Internal dependencies
import {HTTP} from './http';

const abrirCorte = async (totalDelFondo, unidadDeRecaudacionId) => {
  try {
    const response = await HTTP.post('recaudacion/cortes/', {
      total_del_fondo: totalDelFondo,
      unidad_de_recaudacion: unidadDeRecaudacionId,
    });

    if (
      response?.data
      // &&
      // Object.prototype.hasOwnProperty.call(response.data, 'id')
    ) {
      return response?.data;
    }
  } catch (error) {
    console.log(error?.response?.data);
    console.error(error, error?.response?.data?.detail);
    return {response: null, message: error?.response?.data?.detail};
  }
};

export type TMetodosDePagoProps = {
  importe: string;
  metodo_de_pago: number;
};

const cerrarCorte = async (
  corteId: number,
  metodosDePago: TMetodosDePagoProps[],
) => {
  let result = false;
  try {
    const response = await HTTP.post(
      `recaudacion/cortes/${corteId}/cerrar/`,
      metodosDePago,
    );

    if (
      response?.data
      // &&
      // Object.prototype.hasOwnProperty.call(response.data, 'id')
    ) {
      result = true;
    }
  } catch (error) {
    console.error(error, error?.response?.data?.detail);
    console.log(error);
    console.log(error.response.data);
  }

  return result;
};

export {abrirCorte, cerrarCorte};
