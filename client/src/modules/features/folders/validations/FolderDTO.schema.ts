import * as yup from "yup";

export const FolderDTOSchema = yup.object({
  descripcion: yup.string().required("La descripción es requerida"),
  id_grupo: yup
    .number()
    .required("El grupo es requerido")
    .transform((value, originalValue) =>
      originalValue !== null && originalValue === "" ? null : value
    )
    .nullable(),
});
