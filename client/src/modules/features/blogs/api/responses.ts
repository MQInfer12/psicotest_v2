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
  evento_nombre: string | null;
  evento_fecha: string | null;
  evento_latitud: number | null;
  evento_longitud: number | null;
  evento_id_calendar: string | null;
  evento_link_calendar: string | null;
  yo_atiendo: boolean;
  config: CanvasType;
}
