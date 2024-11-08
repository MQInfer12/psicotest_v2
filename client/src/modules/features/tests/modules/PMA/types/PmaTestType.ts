import { TestType } from "../../../types/TestType";

interface ClassicDimention {
  id: number;
  descripcion: string;
  tipo: "classic";
  items: {
    puntuacion: number;
    condiciones: {
      id_pregunta: number;
      id_opcion: number;
    }[];
  }[];
}

interface WordsDimention {
  id: number;
  descripcion: string;
  tipo: "words";
  secciones: number[];
}

export interface PmaTestType extends TestType {
  dimensiones: (ClassicDimention | WordsDimention)[];
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
