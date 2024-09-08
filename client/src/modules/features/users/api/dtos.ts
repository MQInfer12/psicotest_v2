import * as yup from "yup";
import { UserDTOSchema } from "../validations/UserDTOSchema";

export type UserDTO = yup.InferType<typeof UserDTOSchema>;
