import { RespuestaEstado } from "../../answers/types/RespuestaEstado";
import { User } from "../../users/api/responses";

export interface T_Tests {
  id: number;
  nombre_test: string;
  nombre_autor: string | null;
  nombre_autor_creador: string | null;
  canvas: string;
  fotos: (string | null)[];
}

export interface T_Tests_Respuestas {
  id: number;
  id_respuesta: number;
  nombre_asignador: string;
  nombre_user: string;
  email_user: string;
  foto_user: string;
  nombre_test: string;
  nombre_carpeta: string | null;
  nombre_autor: string | null;
  nombre_autor_creador: string | null;
  canvas: string;
  estado: RespuestaEstado;
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

export interface T_Test_Respuesta {
  id: number;
  id_respuesta: number;
  nombre_test: string;
  nombre_autor: string | null;
  nombre_autor_creador: string | null;
  canvas: string;
  version: number;
  test: string;
  resultados: string;
  user: User;
  fecha_enviado: string | null;
  interpretacion: string | null;
}
