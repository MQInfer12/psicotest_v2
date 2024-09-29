export interface TestType {
  requerimientos: Requirements[];
  secciones: Seccion[];
}

interface Seccion {
  items: Item[];
  opciones: Opcion[];
}

export enum Requirements {
  EDAD = "edad",
  GENERO = "genero",
}

export interface Item {
  id: number;
  type?: "image" | "text";
  align?: "center" | "start";
  descripcion: string;
}

interface Opcion {
  id: number;
  descripcion: string;
}
