import { Timestamps } from "@/modules/core/types/Timestamps";

export interface User extends Timestamps {
  email: string;
  nombre: string;
  genero: string | null;
  foto: string | null;
  fecha_nacimiento: string | null;
  estado: boolean;
}
