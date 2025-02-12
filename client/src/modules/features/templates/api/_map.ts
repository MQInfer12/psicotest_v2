import { TemplateDTO } from "./dtos";
import { IA_Plantilla } from "./responses";

declare global {
  interface EndpointMap {
    "GET /plantilla": {
      params: never;
      request: never;
      response: IA_Plantilla[];
    };
    "GET /plantilla/:id": {
      params: {
        id: number;
      };
      request: never;
      response: IA_Plantilla;
    };
    "POST /plantilla": {
      params: never;
      request: TemplateDTO;
      response: IA_Plantilla;
    };
    "PUT /plantilla/:id": {
      params: {
        id: number;
      };
      request: TemplateDTO;
      response: IA_Plantilla;
    };
    "DELETE /plantilla/:id": {
      params: {
        id: number;
      };
      request: null;
      response: null;
    };
  }
}
