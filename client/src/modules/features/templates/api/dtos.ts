import { TemplateDTOSchema } from "../validations/TemplateDTO.schema";
import * as yup from "yup";

export type TemplateDTO = yup.InferType<typeof TemplateDTOSchema>;
