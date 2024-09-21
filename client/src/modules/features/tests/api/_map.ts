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
  }
}
