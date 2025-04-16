import { UserDTO } from "./dtos";
import { User } from "./responses";

declare global {
  interface EndpointMap {
    "GET /user": {
      params: never;
      request: never;
      response: User[];
    };
    "GET /user/for/search": {
      params: never;
      request: never;
      response: User[];
    };
    "GET /user/for/patients": {
      params: never;
      request: never;
      response: User[];
    };
    "POST /user": {
      params: never;
      request: UserDTO;
      response: User;
    };
    "PUT /user/:id/psicotest": {
      params: { id: string };
      request: Partial<UserDTO>;
      response: User;
    };
    "DELETE /user/:id/psicotest": {
      params: { id: string };
      request: null;
      response: null;
    };
    "GET /user/:id/psicotest": {
      params: { id: string };
      request: never;
      response: User;
    };
    "GET /user/:id/psicotest/profile": {
      params: { id: string };
      request: never;
      response: User;
    };
    "PATCH /user/change-state/:id/psicotest": {
      params: { id: string };
      request: null;
      response: User;
    };
    "PATCH /user/change-disponibility/:id/psicotest": {
      params: { id: string };
      request: null;
      response: User;
    };
    "PATCH /user/change-rol/:id/psicotest": {
      params: { id: string };
      request: {
        id_rol: number;
      };
      response: User;
    };
  }
}
