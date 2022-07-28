import http from '../http';

const urlEndpoint = 'empresas/hospedajes/';

const getHospedajes = async (razon_social, nombre_comercial, RFC, page) => {
  let result;
  await http
    .get(urlEndpoint, {
      params: {
        razon_social,
        nombre_comercial,
        RFC,
        page,
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

const deleteHospedaje = async id => {
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

export {getHospedajes, deleteHospedaje};
