import { Timestamps } from "@/modules/core/types/Timestamps";

export interface Folder extends Timestamps {
  id: number;
  email_user: string;
  descripcion: string;
}

export interface SharedFolder {
  id: number;
  email_user: string;
  id_carpeta: number;
}
