import { Rol } from "./responses";

declare global {
  interface EndpointMap {
    "GET /rol": {
      params: never;
      request: null;
      response: Rol[];
    };
  }
}
