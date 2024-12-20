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
  }
}
