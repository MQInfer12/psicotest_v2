import {
  RespuestaDTO,
  RespuestaPatchInterpretationDTO,
  RespuestaPatchInterpretationsDTO,
  SendTestDTO,
  UpdateTestDbDTO,
} from "./dtos";
import {
  T_Test,
  T_Test_Respuesta,
  T_Test_Version,
  T_Tests,
  T_Tests_Respuestas,
} from "./responses";

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
      response: T_Test_Respuesta;
    };
    "GET /test/for/respuesta/:id": {
      params: {
        id: number;
      };
      request: never;
      response: T_Test_Respuesta;
    };
    "GET /test/for/respuesta": {
      params: never;
      request: null;
      response: T_Test_Respuesta[];
    };
    "POST /respuesta": {
      params: never;
      request: RespuestaDTO;
      response: number[];
    };
    "GET /respuesta/for/resolve": {
      params: never;
      request: never;
      response: T_Tests_Respuestas[];
    };
    "GET /respuesta/for/table": {
      params: never;
      request: never;
      response: T_Tests_Respuestas[];
    };
    "PUT /respuesta/:id": {
      params: {
        id: number;
      };
      request: SendTestDTO;
      response: T_Tests_Respuestas;
    };
    "PUT /test/update/db": {
      params: never;
      request: UpdateTestDbDTO;
      response: T_Tests[];
    };
    "PATCH /respuesta/patch/interpretation/:id": {
      params: {
        id: number;
      };
      request: RespuestaPatchInterpretationDTO;
      response: T_Test_Respuesta;
    };
    "PATCH /respuesta/patch/interpretations": {
      params: never;
      request: RespuestaPatchInterpretationsDTO;
      response: T_Tests_Respuestas[];
    };
    "PATCH /respuesta/patch/visibilidad": {
      params: never;
      request: {
        ids: number[];
      };
      response: T_Tests_Respuestas[];
    };
    "PUT /respuesta/delete/many": {
      params: never;
      request: {
        ids: number[];
      };
      response: number;
    };
    "PUT /respuesta/move/many": {
      params: never;
      request: {
        ids: number[];
        //? tomar en cuenta que este parametro deberia ser un number pero se manda string debido al select,
        //? se esta convirtiendo en el backend a number antes de validar
        id_carpeta: string | undefined;
      };
      response: null;
    };
    "GET /version/test/:id": {
      params: {
        id: number;
      };
      request: never;
      response: T_Test_Version[];
    };
  }
}
