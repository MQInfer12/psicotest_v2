import * as yup from "yup";

export const FichaDTOSchema = yup.object({
  metodo: yup.string().required("Requerido"),
  motivo: yup.string().required("Requerido"),
  antecedentes: yup.string().required("Requerido"),
  observaciones: yup.string().required("Requerido"),
});
