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
  config: CanvasType;
}
