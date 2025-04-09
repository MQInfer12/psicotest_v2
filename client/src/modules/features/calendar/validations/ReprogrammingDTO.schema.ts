import * as yup from "yup";

export const ReprogrammingDTOSchema = yup.object({
  descripcion: yup.string().required("Requerido"),
  fecha: yup.string().required("Requerido"),
  id_horario: yup.number().typeError("Requerido").required("Requerido"),
});
