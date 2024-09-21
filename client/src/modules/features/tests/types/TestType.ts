export interface TestType {
  requerimientos: Requirement[];
  secciones: Seccion[];
}

type Requirement = "fecha_nacimiento" | "genero";

interface Seccion {
  items: Item[];
  opciones: Opcion[];
}

export interface Item {
  id: number;
  descripcion: string;
}

interface Opcion {
  id: number;
  descripcion: string;
}
