import { TemplateType } from "../types/TemplateType";

export interface IA_Plantilla {
  id: number;
  nombre: string;
  descripcion: string;
  plantilla: TemplateType;
  id_tests: {
    [nombre: string]: number;
  };
}
