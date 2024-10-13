import { App_ConfiguracionDTO } from "./dtos";
import { App_Configuracion } from "./responses";

declare global {
  interface EndpointMap {
    "GET /configuracion": {
      params: never;
      request: null;
      response: App_Configuracion;
    };
    "PATCH /configuracion": {
      params: never;
      request: App_ConfiguracionDTO;
      response: App_Configuracion;
    };
  }
}
