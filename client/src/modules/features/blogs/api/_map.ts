import { Blog } from "./responses";

declare global {
  interface EndpointMap {
    "GET /blog": {
      params: never;
      request: never;
      response: Blog[];
    };
    "GET /blog/for/me": {
      params: never;
      request: never;
      response: Blog[];
    };
    "GET /blog/:id": {
      params: {
        id: number;
      };
      request: never;
      response: Blog;
    };
    "POST /blog": {
      params: never;
      request: any;
      response: Blog;
    };
  }
}
