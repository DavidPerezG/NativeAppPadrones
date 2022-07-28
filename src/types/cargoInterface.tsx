export interface Cargo {
  actualizaciones: Array<any>;
  cargo_padre: any;
  descripcion: string;
  descuentos_aplicables: Array<any>;
  descuentos_especiales: Array<any>;
  es_accesorio: boolean;
  es_requerible: boolean;
  estados_globales: number;
  fecha_de_vencimiento: any;
  gastos: Array<any>;
  id: number;
  importe: number;
  observaciones: string;
  recargos: Array<any>;
  saldado: boolean;
  tipos_de_gasto: Array<any>;
  tipo_de_cargo: {
    id: number;
    canales_de_pago: Array<number>;
    periodo_fiscal: {
      documento_anexo_PDF: any;
      documento_anexo_word: any;
      fecha_autorizacion: any;
      fecha_final: any;
      fecha_inicial: any;
      identificador: any;
      periodo: any;
      vigente: boolean;
    };
  };
}
