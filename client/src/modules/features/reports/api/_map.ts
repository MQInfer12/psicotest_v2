import { Totales } from "./responses";

declare global {
  interface EndpointMap {
    "GET /reportes/totales": {
      params: never;
      request: never;
      response: Totales;
    };
  }
}
