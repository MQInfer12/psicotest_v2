export interface T_Tests {
  id: number;
  nombre_test: string;
  nombre_autor: string | null;
  nombre_autor_creador: string | null;
  canvas: string;
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
