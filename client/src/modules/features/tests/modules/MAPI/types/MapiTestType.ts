import { TestType } from "../../../types/TestType";

export interface MapiTestType extends TestType {
  dimensiones: {
    id: number;
    descripcion: string;
    abreviacion: string;
    items: {
      puntuacion: number;
      condiciones: {
        id_pregunta: number;
        id_opcion: number;
      }[];
    }[];
  }[];
  escalas: {
    id: number;
    descripcion: string;
    conversiones: {
      edad_minima: number;
      edad_maxima: number;
      genero: string;
      dimensiones: {
        id_dimension: number;
        mapeo: {
          [key: string]: number;
        };
      }[];
    }[];
  }[];
}
