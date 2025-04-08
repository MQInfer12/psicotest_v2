import * as yup from "yup";

export const DerivacionDTOSchema = yup.object({
  derivado_a: yup.string().required("Requerido").nullable(),
  resumen: yup.string().required("Requerido").nullable(),
});
