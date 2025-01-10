import * as yup from "yup";
import { ScheduleDTOSchema } from "../validations/ScheduleDTO.schema";
import { PreAppointmentDTOSchema } from "../validations/PreAppointmentDTO.schema";
import { FichaDTOSchema } from "../validations/FichaDTO.schema";
import { DerivacionDTOSchema } from "../validations/DerivacionDTO.schema";

export type ScheduleDTO = yup.InferType<typeof ScheduleDTOSchema>;
export type PreAppointmentDTO = yup.InferType<typeof PreAppointmentDTOSchema>;
export type FichaDTO = yup.InferType<typeof FichaDTOSchema>;
export type DerivacionDTO = yup.InferType<typeof DerivacionDTOSchema>;
