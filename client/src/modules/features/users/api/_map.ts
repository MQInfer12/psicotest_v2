import { UserDTO } from "./dtos";
import { User } from "./responses";

declare global {
  interface EndpointMap {
    "GET /user": {
      params: never;
      request: never;
      response: User[];
    };
    "POST /user": {
      params: never;
      request: UserDTO;
      response: User;
    };
    "GET /user/:id": {
      params: { id: string };
      request: never;
      response: User;
    };
  }
}
