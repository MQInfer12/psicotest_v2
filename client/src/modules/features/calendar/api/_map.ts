import { User } from "../../users/api/responses";
import { DerivacionDTO, FichaDTO, ScheduleDTO } from "./dtos";
import { Appointment, Schedule } from "./responses";

declare global {
  interface EndpointMap {
    "GET /horario": {
      params: never;
      request: never;
      response: {
        horarios: Schedule[];
        citas: Appointment[];
      };
    };
    "GET /horario/for/me": {
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
      request: {
        id_horario: number;
        fecha: string;
      };
      response: User;
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
  }
}
