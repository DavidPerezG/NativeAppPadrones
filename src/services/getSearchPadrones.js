import http from './http';

const getSearchEmpresas = async (razon_social, nombre_comercial, RFC, page) => {
  let urlEndpoint = 'empresas/agencias/';
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

export {getSearchEmpresas};
