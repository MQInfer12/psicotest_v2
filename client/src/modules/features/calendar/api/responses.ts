export interface Schedule {
  id: number;
  email_user: string;
  nombre_user: string;
  foto_user: string | null;
  dia: number;
  hora_inicio: string;
  hora_final: string;
}

export interface Appointment {
  id: number;
  id_calendar: string;
  html_link_calendar: string;
  email_psicologo: string;
  nombre_psicologo: string;
  foto_psicologo: string | null;
  email_paciente: string;
  nombre_paciente: string;
  foto_paciente: string | null;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
  estado: "accepted" | "declined" | "needsAction" | null;
}
