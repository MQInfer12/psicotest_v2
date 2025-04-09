import * as yup from "yup";

export const CancelationDTOSChema = yup.object({
  descripcion: yup.string().required("Requerido"),
});
