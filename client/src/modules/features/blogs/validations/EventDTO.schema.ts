import * as yup from "yup";

export const EventDTOSchema = yup.object({
  evento_nombre: yup.string().required("El nombre es requerido"),
  evento_fecha: yup.string().required("*"),
  evento_hora: yup.string().required("*"),
  evento_latitud: yup
    .number()
    .typeError("Ingrese un valor válido")
    .required("La latitud es requerida"),
  evento_longitud: yup
    .number()
    .typeError("Ingrese un valor válido")
    .required("La longitud es requerida"),
});

export type EventDTO = yup.InferType<typeof EventDTOSchema>;
