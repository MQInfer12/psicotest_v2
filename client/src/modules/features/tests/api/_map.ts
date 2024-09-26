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
    "GET /respuesta/for/table": {
      params: never;
      request: never;
      response: T_Tests[];
    };
    "PUT /respuesta/:id": {
      params: {
        id: number;
      };
      request: SendTestDTO;
      response: T_Tests;
    };
  }
}
