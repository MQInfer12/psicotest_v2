import * as yup from "yup";
import { FolderDTOSchema } from "../validations/FolderDTO.schema";

export type FolderDTO = yup.InferType<typeof FolderDTOSchema>;
