import { User } from "../../users/api/responses";
import { ScheduleDTO } from "./dtos";
import { Schedule } from "./responses";

declare global {
  interface EndpointMap {
    "GET /horario": {
      params: never;
      request: never;
      response: Schedule[];
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
    "POST /cita": {
      params: never;
      request: {
        id_horario: number;
        fecha: string;
      };
      response: User;
    };
    "DELETE /cita/:id": {
      params: { id: number };
      request: null;
      response: User;
    };
  }
}
