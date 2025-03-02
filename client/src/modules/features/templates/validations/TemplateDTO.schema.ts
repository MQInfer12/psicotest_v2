import * as yup from "yup";

export const TemplateDTOSchema = yup.object({
  nombre: yup.string().required("El nombre es requerido"),
  descripcion: yup.string().required("La descripción es requerida"),
  plantilla: yup.string().required("La plantilla es requerida"),
  contexto: yup.string().nullable(),
  idTests: yup
    .array()
    .of(yup.number())
    .required("Los tests son requeridos")
    .min(2, "Debes seleccionar al menos dos tests"),
});
