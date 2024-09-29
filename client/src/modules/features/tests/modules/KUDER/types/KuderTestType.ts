import { TestType } from "../../../types/TestType";

export interface KuderTestType extends TestType {
  dimensiones: {
    id: number;
    descripcion: string;
    abreviacion: string | null;
    items: {
      puntuacion: number;
      condiciones: {
        id_pregunta: number;
        id_opcion: number;
      }[];
    }[];
  }[];
}
