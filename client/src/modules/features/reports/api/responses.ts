export interface Totales {
  tests: {
    id: number;
    nombre: string;
    tiempo_promedio: number;
    sin_responder: number;
    varones: number;
    mujeres: number;
    sin_especificar: number;
    total: number;
  }[];
  tests_totals: {
    sin_responder: number;
    varones: number;
    mujeres: number;
    sin_especificar: number;
    total: number;
  };
  gabinete: {
    email: string;
    nombre: string;
    varones: number;
    mujeres: number;
    total: number;
  }[];
  gabinete_totals: {
    varones: number;
    mujeres: number;
    total: number;
  };
  gabinete_counters: {
    pasadas_sin_atender: number;
    pasadas_atendidas: number;
    pasadas_derivadas: number;
  };
  blogs_populares: {
    id: number;
    titulo: string;
    visitas: number;
  }[];
  eventos_populares: {
    id: number;
    nombre: string;
    asistencias: number;
  }[];
}
