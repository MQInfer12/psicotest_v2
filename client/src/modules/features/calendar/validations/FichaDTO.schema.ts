import * as yup from "yup";
import { MetodoConsulta } from "../api/responses";

export const FichaDTOSchema = yup.object({
  metodo: yup.string().required("Requerido"),
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
