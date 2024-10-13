import * as yup from "yup";
import { App_ConfiguracionDTOSchema } from "../validations/App_ConfiguracionDTO.schema";

export type App_ConfiguracionDTO = yup.InferType<
  typeof App_ConfiguracionDTOSchema
>;
