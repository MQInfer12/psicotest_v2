import { Timestamps } from "@/modules/core/types/Timestamps";

export type FolderType = "propia" | "compartida" | "global" | null;

export interface Folder extends Timestamps {
  id: number;
  email_user: string;
  descripcion: string;
  global: boolean;
  tipo: FolderType;
}

export interface SharedFolder {
  id: number;
  email_user: string;
  id_carpeta: number;
}
