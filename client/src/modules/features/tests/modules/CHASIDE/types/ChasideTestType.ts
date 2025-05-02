import { TestType } from "../../../types/TestType";

export interface ChasideTestType extends TestType {
  dimensiones: {
    id: number;
    descripcion: string;
    items: {
      puntuacion: number;
      condiciones: {
        id_pregunta: number;
        id_opcion: number;
      }[];
    }[];
  }[];
}
