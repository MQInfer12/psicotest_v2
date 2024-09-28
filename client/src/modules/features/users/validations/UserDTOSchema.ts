import * as yup from "yup";

export const UserDTOSchema = yup.object({
  nombre: yup.string().required("El nombre es requerido"),
  email: yup
    .string()
    .email("El formato del email es incorrecto")
    .required("El email es requerido"),
  foto: yup.string().nullable(),
  genero: yup.string().nullable(),
  fecha_nacimiento: yup.string().nullable(),
});

export const UserRequiredDTOSchema = yup.object({
  genero: yup.string().required("Requerido"),
  fecha_nacimiento: yup
    .string()
    .required("Requerido"),
});
