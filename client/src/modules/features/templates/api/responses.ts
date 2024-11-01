export interface IA_Plantilla {
  id: number;
  nombre: string;
  descripcion: string;
  plantilla: string;
  id_tests: {
    [nombre: string]: number;
  };
}
