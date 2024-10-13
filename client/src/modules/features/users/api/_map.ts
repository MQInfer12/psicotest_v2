
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
    "PUT /user/:id": {
      params: { id: string };
      request: Partial<UserDTO>;
      response: User;
    };
    "DELETE /user/:id": {
      params: { id: string };
      request: null;
      response: null;
    };
    "GET /user/:id": {
      params: { id: string };
      request: never;
      response: User;
    };
    "PATCH /user/change-state/:id":{
      params: {id:string};
      request: null;
      response: User;
    }
  }
}
