import http from '../http';

const urlEndpoint = 'empresas/arrendamientos/';

const getContribuyenteCaja = async q => {
  let result;
  await http
    .get(urlEndpoint, {
      params: {
        q,
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

export {getContribuyenteCaja};
