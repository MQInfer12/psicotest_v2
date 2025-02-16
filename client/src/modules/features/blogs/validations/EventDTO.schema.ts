import * as yup from "yup";

export const EventDTOSchema = yup.object({
  nombre: yup.string().required("El nombre es requerido"),
  fecha: yup.string().required("*"),
  hora: yup.string().required("*"),
  latitud: yup
    .number()
    .typeError("Ingrese un valor válido")
    .required("La latitud es requerida"),
  longitud: yup
    .number()
    .typeError("Ingrese un valor válido")
    .required("La longitud es requerida"),
});

export type EventDTO = yup.InferType<typeof EventDTOSchema>;
