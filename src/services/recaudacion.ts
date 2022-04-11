// Internal dependencies
import {HTTP} from './http';

const abrirCorte = async (totalDelFondo, unidadDeRecaudacionId) => {
  try {
    const response = await HTTP.post('recaudacion/cortes/', {
      total_del_fondo: totalDelFondo,
      unidad_de_recaudacion: unidadDeRecaudacionId,
    });

    if (
      response?.data &&
      Object.prototype.hasOwnProperty.call(response.data, 'id')
    ) {
      return response?.data;
    }
  } catch (error) {
    console.error(error, error?.response?.data?.detail);
  }
  return null;
};

export type TMetodosDePagoProps = {
  importe: string;
  metodo_de_pago: number;
};

const cerrarCorte = async (
  corteId: number,
  metodosDePago: TMetodosDePagoProps[],
) => {
  console.log('cerrarCorte', corteId, metodosDePago);
  let result = false;
  try {
    const response = await HTTP.post(
      `recaudacion/cortes/${corteId}/cerrar/`,
      metodosDePago,
    );

    if (
      response?.data &&
      Object.prototype.hasOwnProperty.call(response.data, 'id')
    ) {
      result = true;
    }
  } catch (error) {
    console.error(error, error?.response?.data?.detail);
  }

  return result;
};

export {abrirCorte, cerrarCorte};
