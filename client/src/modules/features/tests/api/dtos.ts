export interface RespuestaDTO {
  id_test: number;
  email_asignador: string;
  id_carpeta?: number;
}

export interface SendTestDTO {
  resultados: string;
}

export type TextSectionOption = {
  id: string;
  word: string;
  correct: boolean;
};

export interface TestForm {
  idPregunta: number;
  idOpcion: number | (number | TextSectionOption)[];
}

export interface UpdateTestDbDTO {
  tests: {
    id: number;
    test: string;
  }[];
}

export interface RespuestaPatchInterpretationDTO {
  interpretacion: string;
}

export interface RespuestaPatchInterpretationsDTO {
  interpretaciones: {
    id: number;
    interpretacion: string;
  }[];
}
