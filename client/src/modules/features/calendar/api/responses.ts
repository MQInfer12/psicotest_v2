export interface Schedule {
  id: number;
  email_user: string;
  nombre_user: string;
  foto_user: string | null;
  dia: number;
  hora_inicio: string;
  hora_final: string;
}

export type AppointmentStatus = "accepted" | "declined" | "needsAction";
export enum MetodoConsulta {
  PrimeraSesionDelCaso = "Primera sesión del caso",
  Reconsulta = "Reconsulta",
  Inasistencia = "Inasistencia",
  HistorialExtra = "Historial extra",
}

export interface AppointmentSimple {
  id: number;
  id_calendar: string;
  html_link_calendar: string;
  id_caso: number;

  email_psicologo: string;
  nombre_psicologo: string;
  foto_psicologo: string | null;

  email_paciente: string;
  nombre_paciente: string;
  foto_paciente: string | null;

  fecha: string;
  hora_inicio: string;
  hora_final: string;
  fecha_cierre_clinico: string | null;

  id_motivo_consulta: number | null;
  descripcion_motivo_consulta: string | null;

  metodo: MetodoConsulta;
  metodo_inicial: MetodoConsulta;
  motivo: string | null;
  antecedentes: string | null;
  observaciones: string | null;
}

export interface Appointment extends AppointmentSimple {
  cita_proxima: Appointment | null;
  cita_anterior: Appointment | null;
}

export interface Ocuppation {
  id: number;
  email_user: string;
  descripcion: string;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
  citas_colindantes_count: number;
}

export interface MotivoConsulta {
  id: number;
  descripcion: string;
  deleted_at: string | null;
}
