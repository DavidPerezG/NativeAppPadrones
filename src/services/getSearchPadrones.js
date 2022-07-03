import http from './http';

const getSearchEmpresas = async (search, advanceSearch, page) => {
  console.log(search);
  let urlEndpoint = 'empresas/agencias/';
  let result;
  await http
    .get(urlEndpoint, {
      params: {
        razon_social: advanceSearch?.razon_social || search,
        nombre_comercial: advanceSearch?.nombre_comercial,
        pagina_web: advanceSearch?.pagina_web,
        RFC: advanceSearch?.RFC,
        tipo_de_establecimiento: advanceSearch?.tipo_de_establecimiento,
        domicilio_fiscal__codigo_postal: advanceSearch?.codigo_postal,
        domicilio_fiscal_calle_principal: advanceSearch?.calle_principal,
        domicilio_fiscal__numero_exterior: advanceSearch?.numero_exterior,
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

export {getSearchEmpresas};
