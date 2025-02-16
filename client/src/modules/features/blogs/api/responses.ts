import { Timestamps } from "@/modules/core/types/Timestamps";
import { User } from "../../users/api/responses";
import { CanvasType } from "@/modules/core/components/ui/canvas/types/Canvas";

export interface Blog extends Timestamps {
  id: number;
  titulo: string;
  descripcion: string | null;
  portada: string;
  autor: User;
  destacado: boolean;
  evento: Evento | null;
  asistencias: Asistencia[];
  config: CanvasType;
}

export interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  direccion: string;
  latitud: number;
  longitud: number;
}

export interface Asistencia {
  id: number;
  email_user: string;
  nombre_user: string;
  foto_user?: string | null;
  link_calendar: string;
}
