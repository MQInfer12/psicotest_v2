import * as yup from "yup";
import { App_ConfiguracionDTOSchema } from "../validations/App_ConfiguracionDTO.schema";
import { App_ConfiguracionFormSchema } from "../validations/App_ConfiguracionForm.schema";

export type App_ConfiguracionDTO = yup.InferType<
  typeof App_ConfiguracionDTOSchema
>;

export type App_ConfiguracionForm = yup.InferType<
  typeof App_ConfiguracionFormSchema
>;
