import * as yup from "yup";

export const NoteDTOSchema = yup.object({
  descripcion: yup.string().required("Requerido"),
  id_caso: yup.number().integer(),
  id_cita: yup.number().integer(),
});
