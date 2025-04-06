import { Timestamps } from "@/modules/core/types/Timestamps";

export interface Folder extends Timestamps {
  id: number;
  email_user: string;
  descripcion: string;
  global: boolean;
  id_grupo: number | null;
  descripcion_grupo: string | null;
}
