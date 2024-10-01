export interface RespuestaDTO {
  id_test: number;
  email_asignador: string;
}

export interface SendTestDTO {
  resultados: string;
}

export interface TestForm {
  idPregunta: number;
  idOpcion: number | (number | string)[];
}

export interface UpdateTestDbDTO {
  tests: {
    id: number;
    test: string;
  }[];
}
