export interface T_Tests {
  id: number;
  id_respuesta: number | null;
  nombre_asignador: string | null;
  nombre_test: string;
  nombre_autor: string | null;
  nombre_autor_creador: string | null;
  canvas: string;
  estado: "Pendiente" | "Enviado" | null;
}

export interface T_Test {
  id: number;
  nombre_test: string;
  nombre_autor: string | null;
  nombre_autor_creador: string | null;
  canvas: string;
  version: number;
  test: string;
}
