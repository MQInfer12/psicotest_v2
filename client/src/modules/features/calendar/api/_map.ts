import { User } from "../../users/api/responses";
import { ScheduleDTO } from "./dtos";
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
    "POST /cita": {
      params: never;
      request: {
        id_horario: number;
        fecha: string;
        access_token: string;
      };
      response: User;
    };
    "PUT /cita/destroy/:id": {
      params: { id: number };
      request: {
        access_token: string;
      };
      response: User;
    };
  }
}
