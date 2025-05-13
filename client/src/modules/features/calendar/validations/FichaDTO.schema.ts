import * as yup from "yup";
import { MetodoConsulta } from "../api/responses";

export const FichaDTOSchema = yup.object({
  metodo: yup.string().required("Requerido"),
  id_motivo_consulta: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .nullable()
    .test("isRequired", "Requerido", function (value) {
      const { metodo } = this.parent;
      return (
        metodo === MetodoConsulta.Reconsulta ||
        metodo === MetodoConsulta.Inasistencia ||
        !!value
      );
    }),
  motivo: yup.string().test("isRequired", "Requerido", function (value) {
    const { metodo } = this.parent;
    return (
      metodo === MetodoConsulta.Reconsulta ||
      metodo === MetodoConsulta.Inasistencia ||
      !!value?.trim()
    );
  }),
  antecedentes: yup.string().test("isRequired", "Requerido", function (value) {
    const { metodo } = this.parent;
    return (
      metodo === MetodoConsulta.Reconsulta ||
      metodo === MetodoConsulta.Inasistencia ||
      !!value?.trim()
    );
  }),
  observaciones: yup.string().required("Requerido"),
});
