export interface TestType {
  requerimientos: Requirements[];
  secciones: Seccion[];
}

export enum Requirements {
  EDAD = "edad",
  GENERO = "genero",
  TELEFONO = "telefono",
  NOMBRE_TUTOR = "nombre_tutor",
  TELEFONO_TUTOR = "telefono_tutor",
}

export interface Item {
  id: number;
  type?: "image" | "text"; //DEFAULT "text"
  align?: "center" | "start"; //DEFAULT "start"
  descripcion: string;
}

export interface Opcion {
  id: number;
  descripcion: string;
}

export interface Seccion {
  id: number;
  required?: boolean; //default true
  type?: "multi" | "single" | "text"; //DEFAULT "single"
  //! type "text" is only developed for PMA test
  maxWords?: number;
  //! maxWords should only work in "text" sections
  timer?: number;
  shortDescription?: string;
  description?: (SeccionTitle | SeccionParagraph)[];
  customPrompt?: string;
  items: Item[];
  opciones: Opcion[];
}

interface SeccionTitle {
  type: "title";
  content: string;
}

interface SeccionParagraph {
  type: "paragraph";
  align?: "start" | "center"; //DEFAULT "start"
  content: string;
}
