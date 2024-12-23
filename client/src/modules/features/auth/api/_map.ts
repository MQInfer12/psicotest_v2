import { User } from "../../users/api/responses";
import { LoginDTO } from "./dtos";

declare global {
  interface EndpointMap {
    "GET /me": {
      params: never;
      request: null;
      response: User;
    };
    "POST /login": {
      params: never;
      request: LoginDTO;
      response: {
        token: string;
        user: User;
        access_token: string;
      };
    };
    "POST /logout": {
      params: never;
      request: null;
      response: null;
    };
  }
}
