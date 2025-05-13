import { User } from "../../users/api/responses";
import {
  AppointmentDTO,
  CancelationDTO,
  FichaDTO,
  MotivoConsultaDTO,
  OcuppationDTO,
  ReprogrammingDTO,
  ScheduleDTO,
} from "./dtos";
import {
  Appointment,
  AppointmentStatus,
  MotivoConsulta,
  Ocuppation,
  Schedule,
} from "./responses";

declare global {
  interface EndpointMap {
    "GET /horario": {
      params: never;
      request: never;
      response: {
        horarios: Schedule[];
        citas: Appointment[];
        ocupaciones: Ocuppation[];
      };
    };
    "GET /horario/for/me": {
      params: never;
      request: never;
      response: Schedule[];
    };
    "GET /horario/for/reprogramming": {
      params: never;
      request: never;
      response: Schedule[];
    };
    "POST /horario": {
      params: never;
      request: ScheduleDTO;
      response: Schedule;
    };
    "DELETE /horario/:id": {
      params: { id: number };
      request: null;
      response: null;
    };
    "GET /cita": {
      params: never;
      request: never;
      response: Appointment[];
    };
    "GET /cita/paciente/:email/psicotest": {
      params: {
        email: string;
      };
      request: never;
      response: Appointment[];
    };
    "GET /cita/:id": {
      params: {
        id: number;
      };
      request: never;
      response: {
        cita: Appointment;
        paciente: User;
      };
    };
    "GET /cita/respuesta/status/:id_calendar": {
      params: {
        id_calendar: string;
      };
      request: never;
      response: AppointmentStatus;
    };
    "PATCH /cita/respuesta/:id": {
      params: { id: number };
      request: {
        estado: "accepted" | "declined";
      };
      response: Appointment;
    };
    "POST /cita": {
      params: never;
      request: AppointmentDTO;
      response: {
        cita: Appointment;
        paciente: User;
      };
    };
    "PUT /cita/:id": {
      params: {
        id: number;
      };
      request: FichaDTO;
      response: Appointment;
    };
    "PUT /cita/destroy/:id": {
      params: { id: number };
      request: null;
      response: User;
    };
    "PATCH /cita/cerrar/:id": {
      params: { id: number };
      request: null;
      response: Appointment;
    };
    "PATCH /cita/reprogramacion/:id": {
      params: { id: number };
      request: ReprogrammingDTO;
      response: Appointment;
    };
    "PATCH /cita/cancelacion/:id": {
      params: { id: number };
      request: CancelationDTO;
      response: null;
    };
    "PATCH /caso/cerrar/cita/:idCita": {
      params: { idCita: number };
      request: null;
      response: Appointment;
    };
    "GET /ocupacion": {
      params: never;
      request: never;
      response: Ocuppation[];
    };
    "POST /ocupacion": {
      params: never;
      request: OcuppationDTO;
      response: Ocuppation;
    };
    "PUT /ocupacion/:id": {
      params: { id: number };
      request: OcuppationDTO;
      response: Ocuppation;
    };
    "DELETE /ocupacion/:id": {
      params: { id: number };
      request: null;
      response: null;
    };
    "GET /motivo-consulta": {
      params: never;
      request: never;
      response: MotivoConsulta[];
    };
    "POST /motivo-consulta": {
      params: never;
      request: MotivoConsultaDTO;
      response: MotivoConsulta;
    };
    "PUT /motivo-consulta/:id": {
      params: { id: number };
      request: MotivoConsultaDTO;
      response: MotivoConsulta;
    };
    "DELETE /motivo-consulta/:id": {
      params: { id: number };
      request: null;
      response: null;
    };
  }
}
