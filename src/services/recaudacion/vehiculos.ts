import {EstadoVehiculo} from '../../types/estadoVehiculoInterface';
import {ServicioVehiculo} from '../../types/serviciosVehiculoInterface';
import {Vehiculo} from '../../types/vehiculoInterface';
import http from '../http';

const urlEndpoint = 'recaudacion/vehiculos/';

const getVehiculo = async (formData, page): Promise<Vehiculo[]> => {
  let result;
  await http
    .get(urlEndpoint, {
      params: {
        numero_de_placa: formData.numero_de_placa,
        serie: formData.serie,
        modelo_del_vehiculo: formData.modelo_del_vehiculo,
        tarjeta_de_circulacion: formData.tarjeta_de_circulacion,
        clave_vehicular: formData.clave_vehicular,
        servicio: formData.servicio,
        estatus_del_vehiculo: formData.estatus_del_vehiculo,
        tipo_de_vehiculo: formData.tipo_de_vehiculo,
        page,
      },
    })
    .then(
      response => {
        result = response.data;
      },
      error => {
        console.error(error);
        console.log(error.response);
      },
    );
  return result;
};

const deleteVehiculo = async id => {
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

const getServiciosVehiculo = async (): Promise<ServicioVehiculo[]> => {
  let result;
  await http.get('recaudacion/servicios-del-vehiculo/').then(
    response => {
      result = response.data;
    },
    error => {
      console.log(error);
    },
  );
  return result;
};

const getEstadosVehiculo = async (id, page): Promise<EstadoVehiculo[]> => {
  let result;
  await http
    .get('recaudacion/estados-del-vehiculo/', {params: {id, page}})
    .then(
      response => {
        result = response.data;
      },
      error => {
        console.log(error);
      },
    );
  return result;
};

const getMarcasVehiculo = async () => {
  let result;
  await http.get('recaudacion/marcas-de-vehiculos').then(
    response => {
      result = response.data.results;
    },
    error => {
      console.log(error);
    },
  );
  return result;
};

const getTiposVehiculo = async () => {
  let result;
  await http.get('recaudacion/tipos-de-vehiculos').then(
    response => {
      result = response.data;
    },
    error => {
      console.log(error);
    },
  );
  return result;
};

const getLineasVehiculares = async () => {
  let result;
  await http.get('recaudacion/lineas-vehiculares/').then(
    response => {
      result = response.data.results;
    },
    error => {
      console.log(error);
    },
  );
  return result;
};

const getClasesVehiculos = async () => {
  let result;
  await http.get('recaudacion/clases-de-vehiculos/').then(
    response => {
      result = response?.data;
    },
    error => {
      console.log(error);
    },
  );
  return result;
};

export {
  getVehiculo,
  deleteVehiculo,
  getServiciosVehiculo,
  getEstadosVehiculo,
  getMarcasVehiculo,
  getTiposVehiculo,
  getLineasVehiculares,
  getClasesVehiculos,
};
