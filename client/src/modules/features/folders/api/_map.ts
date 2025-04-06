import { FolderDTO } from "./dtos";
import { Folder } from "./responses";

declare global {
  interface EndpointMap {
    "GET /carpeta": {
      params: never;
      request: never;
      response: Folder[];
    };
    "POST /carpeta": {
      params: never;
      request: FolderDTO;
      response: Folder;
    };
    "PUT /carpeta/:id": {
      params: { id: number };
      request: Partial<FolderDTO>;
      response: Folder;
    };
    "DELETE /carpeta/:id": {
      params: { id: number };
      request: null;
      response: null;
    };
  }
}
