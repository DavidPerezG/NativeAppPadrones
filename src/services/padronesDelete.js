// https://apigrp.migob.mx/empresas/agencias/12/
import http from './http';

const deleteAgencia = async id => {
  let urlEndpoint = 'empresas/agencias/' + id;
  let result;
  await http.delete(urlEndpoint).then(
    response => {
      result = response.data;
    },
    error => {
      console.error(error);
    },
  );

  return result;
};

export {deleteAgencia};
