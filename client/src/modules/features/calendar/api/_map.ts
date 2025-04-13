import { User } from "../../users/api/responses";
import {
  AppointmentDTO,
  CancelationDTO,
  DerivacionDTO,
  FichaDTO,
  OcuppationDTO,
  ReprogrammingDTO,
  ScheduleDTO,
} from "./dtos";
import { Appointment, Ocuppation, Schedule } from "./responses";

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
    "GET /cita/respuesta/status": {
      params: {
        id_calendar: string;
      };
      request: never;
      response: "accepted" | "declined" | "needsAction";
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
      request: FichaDTO | DerivacionDTO;
      response: Appointment;
    };
    "PUT /cita/destroy/:id": {
      params: { id: number };
      request: null;
      response: User;
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
  }
}
