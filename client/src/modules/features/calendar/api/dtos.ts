import * as yup from "yup";
import { ScheduleDTOSchema } from "../validations/ScheduleDTO.schema";

export type ScheduleDTO = yup.InferType<typeof ScheduleDTOSchema>;
