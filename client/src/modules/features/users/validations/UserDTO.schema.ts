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
  carrera: yup.string().nullable(),
  semestre: yup.number().nullable(),
  codigo_estudiantil: yup.string().nullable(),
  telefono: yup.number().nullable(),
  nombre_tutor: yup.string().nullable(),
  telefono_tutor: yup.number().nullable(),
});

export const UserRequiredDTOSchema = yup.object().shape({
  nombre: yup.string().when("$requirements", ([requirements], schema) => {
    if (requirements.includes(Requirements.NOMBRE))
      return schema.required("Requerido");
    return schema;
  }),
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
  telefono: yup
    .number()
    .typeError("Requerido")
    .when("$requirements", ([requirements], schema) => {
      if (requirements.includes(Requirements.TELEFONO))
        return schema.required("Requerido");
      return schema;
    }),
  nombre_tutor: yup.string().when("$requirements", ([requirements], schema) => {
    if (requirements.includes(Requirements.NOMBRE_TUTOR))
      return schema.required("Requerido");
    return schema;
  }),
  telefono_tutor: yup
    .number()
    .typeError("Requerido")
    .when("$requirements", ([requirements], schema) => {
      if (requirements.includes(Requirements.TELEFONO_TUTOR))
        return schema.required("Requerido");
      return schema;
    }),
  carrera: yup.string().when("$requirements", ([requirements], schema) => {
    if (requirements.includes(Requirements.CARRERA))
      return schema.required("Requerido");
    return schema;
  }),
  semestre: yup
    .number()
    .typeError("Requerido")
    .when("$requirements", ([requirements], schema) => {
      if (requirements.includes(Requirements.SEMESTRE))
        return schema.required("Requerido");
      return schema;
    }),
  codigo_estudiantil: yup
    .string()
    .when("$requirements", ([requirements], schema) => {
      if (requirements.includes(Requirements.CODIGO_ESTUDIANTIL))
        return schema.required("Requerido");
      return schema;
    }),
  institucion: yup.string().when("$requirements", ([requirements], schema) => {
    if (requirements.includes(Requirements.INSTITUCION))
      return schema.required("Requerido");
    return schema;
  }),
  curso: yup.string().when("$requirements", ([requirements], schema) => {
    if (requirements.includes(Requirements.CURSO))
      return schema.required("Requerido");
    return schema;
  }),
  municipio: yup.string().when("$requirements", ([requirements], schema) => {
    if (requirements.includes(Requirements.MUNICIPIO))
      return schema.required("Requerido");
    return schema;
  }),
});
