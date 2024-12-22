export interface Schedule {
  id: number;
  email_user: string;
  nombre_user: string;
  dia: number;
  hora_inicio: string;
  hora_final: string;
}

export interface Appointment {
  id: number;
  email_psicologo: string;
  nombre_psicologo: string;
  email_paciente: string;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
}
