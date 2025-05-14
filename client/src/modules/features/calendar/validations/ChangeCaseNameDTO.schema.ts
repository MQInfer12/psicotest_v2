import * as yup from "yup";

export const ChangeCaseNameDTOSchema = yup.object({
  nombre: yup.string(),
});
