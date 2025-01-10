import * as yup from "yup";

export const PreAppointmentDTOSchema = yup.object({
  nombre: yup.string().required("Requerido"),
  genero: yup.string().required("Requerido"),
  fecha_nacimiento: yup.string().required("Requerido"),
  carrera: yup.string().required("Requerido"),
  semestre: yup.number().min(0, "*").typeError("*").integer("*").required("*"),
  codigo_estudiantil: yup
    .number()
    .typeError("Ingresa un valor válido")
    .integer("Número entero")
    .required("Requerido"),
  telefono: yup
    .number()
    .integer("Número entero")
    .typeError("Ingresa un valor válido")
    .required("Requerido"),
  nombre_tutor: yup.string(),
  telefono_tutor: yup
    .number()
    .nullable()
    .transform((v) => {
      return isNaN(v) ? null : v;
    }),
});
