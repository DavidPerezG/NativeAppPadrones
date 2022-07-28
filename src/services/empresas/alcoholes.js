import http from '../http';

const urlEndpoint = 'empresas/alcoholes/';

const getAlcoholes = async (razon_social, nombre_comercial, RFC, page) => {
  console.log(razon_social, nombre_comercial, RFC, page);
  console.log('alcoholes');
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
        console.log(error.response);
      },
    );
  return result;
};

const deleteAlcohol = async id => {
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

export {getAlcoholes, deleteAlcohol};
