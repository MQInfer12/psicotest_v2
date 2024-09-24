import { RespuestaDTO, SendTestDTO } from "./dtos";
import { T_Test, T_Tests } from "./responses";

declare global {
  interface EndpointMap {
    "GET /test": {
      params: never;
      request: never;
      response: T_Tests[];
    };
    "GET /test/:id": {
      params: {
        id: number;
      };
      request: never;
      response: T_Test;
    };
    "GET /test/by/respuesta/:id": {
      params: {
        id: number;
      };
      request: never;
      response: T_Test;
    };
    "GET /test/mapi/answers": {
      params: never;
      request: never;
      response: {
        idPregunta: number;
        idOpcion: number;
      }[];
    };
    "POST /respuesta": {
      params: never;
      request: RespuestaDTO;
      response: number;
    };
    "GET /respuesta/for/resolve": {
      params: never;
      request: never;
      response: T_Tests[];
    };
    "PUT /respuesta/:id": {
      params: {
        id: number;
      };
      request: SendTestDTO;
      response: number;
    };
  }
}
