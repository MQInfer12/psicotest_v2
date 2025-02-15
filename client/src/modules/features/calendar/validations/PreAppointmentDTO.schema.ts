import * as yup from "yup";

export const PreAppointmentDTOSchema = yup.object({
  nombre: yup.string().required("Requerido"),
  genero: yup.string().when("$required", (ctx, schema) => {
    const [required] = ctx;
    if (required) {
      return schema.required("Requerido");
    }
    return schema;
  }),
  fecha_nacimiento: yup.string().when("$required", (ctx, schema) => {
    const [required] = ctx;
    if (required) {
      return schema.required("Requerido");
    }
    return schema;
  }),
  carrera: yup.string().when("$required", (ctx, schema) => {
    const [required] = ctx;
    if (required) {
      return schema.required("Requerido");
    }
    return schema;
  }),
  semestre: yup
    .number()
    .integer("*")
    .when("$required", (ctx, schema) => {
      const [required] = ctx;
      if (required) {
        return schema.min(0, "*").typeError("*").required("*");
      }
      return schema.nullable().transform((v) => {
        return isNaN(v) ? null : v;
      });
    }),
  codigo_estudiantil: yup
    .number()
    .integer("Número entero")
    .when("$required", (ctx, schema) => {
      const [required] = ctx;
      if (required) {
        return schema
          .typeError("Ingresa un valor válido")
          .required("Requerido");
      }
      return schema.nullable().transform((v) => {
        return isNaN(v) ? null : v;
      });
    }),
  telefono: yup
    .number()
    .integer("Número entero")
    .when("$required", (ctx, schema) => {
      const [required] = ctx;
      if (required) {
        return schema
          .typeError("Ingresa un valor válido")
          .required("Requerido");
      }
      return schema.nullable().transform((v) => {
        return isNaN(v) ? null : v;
      });
    }),
  nombre_tutor: yup.string().when("$required", (ctx, schema) => {
    const [required] = ctx;
    if (required) {
      return schema.required("Requerido");
    }
    return schema;
  }),
  telefono_tutor: yup
    .number()
    .integer("Número entero")
    .when("$required", (ctx, schema) => {
      const [required] = ctx;
      if (required) {
        return schema.typeError("Requerido").required("Requerido");
      }
      return schema.nullable().transform((v) => {
        return isNaN(v) ? null : v;
      });
    }),
});
