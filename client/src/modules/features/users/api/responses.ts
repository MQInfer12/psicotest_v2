import { Timestamps } from "@/modules/core/types/Timestamps";
import { Genero } from "../types/Genero";
import { Permisos } from "../../auth/types/Permisos";
import { Appointment } from "../../calendar/api/responses";

export interface User extends Timestamps {
  email: string;
  nombre: string;
  genero: Genero | null;
  foto: string | null;
  fecha_nacimiento: string | null;
  estado: boolean;
  id_rol: number;
  permisos: Permisos[];
  cita_proxima: Appointment | null;
}
