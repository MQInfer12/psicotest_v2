export interface TestType {
  requerimientos: Requirements[];
  secciones: Seccion[];
}

interface Seccion {
  type?: "multi" | "single"; //DEFAULT "single"
  items: Item[];
  opciones: Opcion[];
}

export enum Requirements {
  EDAD = "edad",
  GENERO = "genero",
}

export interface Item {
  id: number;
  type?: "image" | "text"; //DEFAULT "text"
  align?: "center" | "start"; //DEFAULT "start"
  descripcion: string;
}

interface Opcion {
  id: number;
  descripcion: string;
}
