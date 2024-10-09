import * as yup from "yup";

export const FolderDTOSchema = yup.object({
  descripcion: yup.string().required("La descripción es requerida"),
});
