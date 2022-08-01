import http from './http';

const getPadrones = async () => {
  await http.get('catalogos/padrones/').then(
    response => {
      const result = response.data;
      return result;
    },
    error => {
      console.error(error);
    },
  );
};

const getCiudadano = async (search, advanceSearch) => {
  let urlEndpoint = 'cuentaunicasir/ciudadano-caja/';
  let result;
  await http
    .get(urlEndpoint, {
      params: {
        q: search,
        clave_ciudadana: advanceSearch?.clave_ciudadana,
        first_name: advanceSearch?.first_name,
        last_name: advanceSearch?.last_name,
        second_last_name: advanceSearch?.second_last_name,
        email: advanceSearch?.email,
        numero_de_celular: advanceSearch?.numero_de_celular,
        CURP: advanceSearch?.CURP,
        RFC: advanceSearch?.RFC,
      },
    })
    .then(
      response => {
        result = response.data.results;
      },
      error => {
        console.error(error);
        console.log(error.response);
      },
    );

  return result;
};

const getAdeudoCiudadano = async ciudadano => {
  let result;
  if (ciudadano !== undefined && ciudadano !== null) {
    await http.get(`recaudacion/consulta-caja/${ciudadano?.id}`).then(
      response => {
        result = response?.data[0];
      },
      error => {
        console.error(error);
      },
    );
  } else {
    result = null;
  }
  return result;
};

const getVehiculo = async (search, advanceSearch) => {
  let urlEndpoint = 'recaudacion/vehiculos-caja/';
  let result;
  await http
    .get(urlEndpoint, {
      params: {
        q: search,
        numero_de_placa: advanceSearch?.numero_de_placa,
        tipo_de_vehiculo: advanceSearch?.tipo_de_vehiculo,
        linea: advanceSearch?.linea,
        clase_del_vehiculo: advanceSearch?.clase_del_vehiculo,
        servicio: advanceSearch?.servicio,
        estatus_del_vehiculo: advanceSearch?.estatus_del_vehiculo,
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

const getPredio = async (search, advanceSearch) => {
  let urlEndpoint = 'catastro/predio-caja/';
  let result;
  await http
    .get(urlEndpoint, {
      params: {
        q: search,
        razon_social: advanceSearch?.razon_social,
        nombre_comercial: advanceSearch?.nombre_comercial,
        pagina_web: advanceSearch?.pagina_web,
        RFC: advanceSearch?.RFC,
        tipo_de_establecimiento: advanceSearch?.tipo_de_establecimiento,
        domicilio_fiscal__codigo_postal: advanceSearch?.codigo_postal,
        domicilio_fiscal_calle_principal: advanceSearch?.calle_principal,
        domicilio_fiscal__numero_exterior: advanceSearch?.numero_exterior,
        cuenta_unica_de_predial: advanceSearch?.cuenta_unica_de_predial,
        CURT: advanceSearch?.CURT,
        clave_catastral_estandar: advanceSearch?.clave_catastral_estandar,
        clave_catastral_municipal: advanceSearch?.clave_catastral_municipal,
        direccion__codigo_postal: advanceSearch?.direccion_codigo_postal,
        direccion__calle_principal: advanceSearch?.direccion_calle_principal,
        direccion_numero_exterior: advanceSearch?.direccion_numero_exterior,
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

const getEmpresa = async (search, advanceSearch, nombrePadron) => {
  nombrePadron = nombrePadron.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (nombrePadron === 'Juego De Azar') {
    nombrePadron = 'Juego-de-azar';
  } else if (nombrePadron.trim() === 'Casa De Empeno') {
    nombrePadron = 'Casa-de-impenio';
  }
  let urlEndpoint = 'empresas/' + nombrePadron.toLowerCase() + '-caja/';
  let result;
  await http
    .get(urlEndpoint, {
      params: {
        q: search,
        razon_social: advanceSearch?.razon_social,
        nombre_comercial: advanceSearch?.nombre_comercial,
        pagina_web: advanceSearch?.pagina_web,
        RFC: advanceSearch?.RFC,
        tipo_de_establecimiento: advanceSearch?.tipo_de_establecimiento,
        domicilio_fiscal__codigo_postal: advanceSearch?.codigo_postal,
        domicilio_fiscal_calle_principal: advanceSearch?.calle_principal,
        domicilio_fiscal__numero_exterior: advanceSearch?.numero_exterior,
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

const getAgencia = async (search, advanceSearch, page) => {
  let urlEndpoint = 'empresas/agencia-caja/';
  let result;
  await http
    .get(urlEndpoint, {
      params: {
        q: search,
        razon_social: advanceSearch?.razon_social,
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

//Agarra todos los adeudos/cargos de un padron, tomando como base su numero de padron
const getAdeudoPadron = async (padron, numeroPadron) => {
  let result;
  if (padron !== undefined && padron !== null) {
    await http
      .post('recaudacion/consulta-caja/padron/', {
        padron_id: padron.id,
        padron: numeroPadron,
        canal_de_pago: 3,
        entidad_municipal: 2,
      })
      .then(
        response => {
          result = response.data;
        },
        error => {
          console.error(error);
        },
      );
  } else {
    result = null;
  }
  return result;
};

export {
  getPadrones,
  getCiudadano,
  getAdeudoCiudadano,
  getVehiculo,
  getPredio,
  getEmpresa,
  getAgencia,
  getAdeudoPadron,
};
