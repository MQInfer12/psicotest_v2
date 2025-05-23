import * as yup from "yup";
import { ScheduleDTOSchema } from "../validations/ScheduleDTO.schema";
import { PreAppointmentDTOSchema } from "../validations/PreAppointmentDTO.schema";
import { FichaDTOSchema } from "../validations/FichaDTO.schema";
import { DerivacionDTOSchema } from "../validations/DerivacionDTO.schema";
import { ReprogrammingDTOSchema } from "../validations/ReprogrammingDTO.schema";
import { CancelationDTOSChema } from "../validations/CancelationDTO.schema";
import { OcuppationDTOSchema } from "../validations/OcuppationDTO.schema";
import { AppointmentDTOSchema } from "../validations/AppointmentDTO.schema";
import { MotivoConsultaDTOSchema } from "../validations/MotivoConsultaDTO.schema";
import { ChangeCaseNameDTOSchema } from "../validations/ChangeCaseNameDTO.schema";
import { CloseCaseDTOSchema } from "../validations/CloseCaseDTO.schema";
import { NoteDTOSchema } from "../validations/NoteDTO.schema";

export type ScheduleDTO = yup.InferType<typeof ScheduleDTOSchema>;
export type PreAppointmentDTO = yup.InferType<typeof PreAppointmentDTOSchema>;
export type FichaDTO = yup.InferType<typeof FichaDTOSchema>;
export type DerivacionDTO = yup.InferType<typeof DerivacionDTOSchema>;

export type OcuppationDTO = yup.InferType<typeof OcuppationDTOSchema>;

export type ReprogrammingDTO = yup.InferType<typeof ReprogrammingDTOSchema>;
export type CancelationDTO = yup.InferType<typeof CancelationDTOSChema>;

export type AppointmentDTO = yup.InferType<typeof AppointmentDTOSchema>;
export type MotivoConsultaDTO = yup.InferType<typeof MotivoConsultaDTOSchema>;

export type ChangeCaseNameDTO = yup.InferType<typeof ChangeCaseNameDTOSchema>;
export type CloseCaseDTO = yup.InferType<typeof CloseCaseDTOSchema>;

export type NoteDTO = yup.InferType<typeof NoteDTOSchema>;
