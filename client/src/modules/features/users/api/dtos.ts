import * as yup from "yup";
import {
  UserDTOSchema,
  UserRequiredDTOSchema,
} from "../validations/UserDTOSchema";

export type UserDTO = yup.InferType<typeof UserDTOSchema>;
export type UserRequiredDTO = yup.InferType<typeof UserRequiredDTOSchema>;
