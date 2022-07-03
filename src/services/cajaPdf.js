import http from './http';

const imprimirObligaciones = async (padron_id, tipo_de_padron) => {
  let base64;
  try {
    const response = await http.post(
      '/cuentaunicasir/opinion-de-las-obligaciones/pdf/',
      {
        padron_id,
        tipo_de_padron,
      },
    );
    if (response?.status === 200) {
      base64 = `data:application/pdf;base64,${response.data.data}`;
    }
  } catch (err) {
    console.error(err);
  }

  return base64;
};

const imprimirConstancia = async padron_id => {
  let base64;
  try {
    const response = await http.get(
      `/recaudacion/reportes/${padron_id}/constancia-de-situacion-municipal/`,
    );
    if (response?.status === 200) {
      base64 = `data:application/pdf;base64,${response.data.pdf}`;
    }
  } catch (error) {
    console.error(error);
  }

  return base64;
};

const getRecibos = async (ciudadano, metodos_de_pago, padrones) => {
  let result;
  let body = {
    ciudadano: ciudadano,
    metodos_de_pago: metodos_de_pago,
    padrones: padrones,
  };
  try {
    let response = await http.post('/recaudacion/recibos/', body);
    result = response.data;
  } catch (error) {
    console.log(error.response.data);
  }
  console.log('result recibos');
  console.log(result);
  return result;
};

const getBase64Recibos = async id => {
  let base64;
  try {
    const res = await http.post('/recaudacion/recibo/pdfs/', {
      recibos_id: id,
    });
    if (res?.status === 200) {
      base64 = `data:application/pdf;base64,${res.data.data}`;
    }
  } catch (error) {
    console.log(error);
    console.log(error.response.data);
  }

  return base64;
};

const getBase64Ticket = async id => {
  let base64;
  try {
    const res = await http.post('/recaudacion/recibo-ticket/pdfs/', {
      recibos_id: id,
    });
    if (res?.status === 200) {
      base64 = `data:application/pdf;base64,${res.data.data}`;
    }
  } catch (error) {
    console.log(error);
    console.log(error.response.data);
  }

  return base64;
};

export {
  imprimirObligaciones,
  imprimirConstancia,
  getRecibos,
  getBase64Recibos,
  getBase64Ticket,
};
