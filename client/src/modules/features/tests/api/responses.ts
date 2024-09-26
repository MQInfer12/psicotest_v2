export interface T_Tests {
  id: number;
  id_respuesta?: number;
  nombre_asignador?: string;
  nombre_test: string;
  nombre_autor: string | null;
  nombre_autor_creador: string | null;
  nombre_user?: string;
  foto_user?: string;
  email_user?: string;
  canvas: string;
  estado?: "Pendiente" | "Enviado";
  fotos?: string[];
}

export interface T_Test {
  id: number;
  nombre_test: string;
  nombre_autor: string | null;
  nombre_autor_creador: string | null;
  canvas: string;
  version: number;
  test: string;
  resultados: string | null;
}
