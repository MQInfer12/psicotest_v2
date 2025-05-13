import * as yup from "yup";

export const MotivoConsultaDTOSchema = yup.object({
  descripcion: yup.string().required("Requerido"),
});
