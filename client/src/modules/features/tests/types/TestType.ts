export interface TestType {
  requerimientos: Requirement[];
  secciones: Seccion[];
}


interface Seccion {
  items: Item[];
  opciones: Opcion[];
}

type Requirement = "fecha_nacimiento" | "genero";

export interface Item {
  id: number;
  descripcion: string;
}

interface Opcion {
  id: number;
  descripcion: string;
}
