import { IA_Plantilla } from "./responses";

declare global {
  interface EndpointMap {
    "GET /plantilla": {
      params: never;
      request: never;
      response: IA_Plantilla[];
    };
  }
}
