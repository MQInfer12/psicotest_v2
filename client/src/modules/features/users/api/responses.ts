import { Timestamps } from "@/modules/core/types/Timestamps";
import { Genero } from "../types/Genero";
import { Permisos } from "../../auth/types/Permisos";
import { Appointment } from "../../calendar/api/responses";
import { T_Grupo } from "../../tests/api/responses";

export interface User extends Timestamps {
  email: string;
  nombre: string;
  genero: Genero | null;
  foto: string | null;
  fecha_nacimiento: string | null;

  nombre_verificado: boolean;

  carrera: string | null;
  semestre: number | null;
  codigo_estudiantil: string | null;
  telefono: number | null;
  nombre_tutor: string | null;
  telefono_tutor: number | null;

  contador_citas: number;
  fecha_ultima_cita: string | null;

  estado: boolean;
  disponible: boolean;

  id_rol: number;
  grupos: T_Grupo[];
  permisos: Permisos[];
  cita_proxima: Appointment | null;
}
