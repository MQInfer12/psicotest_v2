import * as yup from "yup";
import { ScheduleDTOSchema } from "../validations/ScheduleDTO.schema";
import { PreAppointmentDTOSchema } from "../validations/PreAppointmentDTO.schema";
import { FichaDTOSchema } from "../validations/FichaDTO.schema";
import { DerivacionDTOSchema } from "../validations/DerivacionDTO.schema";
import { ReprogrammingDTOSchema } from "../validations/ReprogrammingDTO.schema";
import { CancelationDTOSChema } from "../validations/CancelationDTO.schema";
import { OcuppationDTOSchema } from "../validations/OcuppationDTO.schema";
import { AppointmentDTOSchema } from "../validations/AppointmentDTO.schema";

export type ScheduleDTO = yup.InferType<typeof ScheduleDTOSchema>;
export type PreAppointmentDTO = yup.InferType<typeof PreAppointmentDTOSchema>;
export type FichaDTO = yup.InferType<typeof FichaDTOSchema>;
export type DerivacionDTO = yup.InferType<typeof DerivacionDTOSchema>;

export type OcuppationDTO = yup.InferType<typeof OcuppationDTOSchema>;

export type ReprogrammingDTO = yup.InferType<typeof ReprogrammingDTOSchema>;
export type CancelationDTO = yup.InferType<typeof CancelationDTOSChema>;

export type AppointmentDTO = yup.InferType<typeof AppointmentDTOSchema>;
