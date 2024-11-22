import * as yup from "yup";
import { Requirements } from "../../tests/types/TestType";

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

export const UserRequiredDTOSchema = yup.object().shape({
  genero: yup.string().when("$requirements", ([requirements], schema) => {
    if (requirements.includes(Requirements.GENERO))
      return schema.required("Requerido");
    return schema;
  }),
  fecha_nacimiento: yup
    .string()
    .when("$requirements", ([requirements], schema) => {
      if (requirements.includes(Requirements.EDAD))
        return schema.required("Requerido");
      return schema;
    }),
});
