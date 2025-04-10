import * as yup from "yup";
import { MetodoConsulta } from "../components/AppointmentPage/FichaForm";

export const FichaDTOSchema = yup.object({
  metodo: yup.string().required("Requerido"),
  motivo: yup.string().test("isRequired", "Requerido", function () {
    const { metodo } = this.parent;
    return metodo === MetodoConsulta.Reconsulta;
  }),
  antecedentes: yup.string().test("isRequired", "Requerido", function () {
    const { metodo } = this.parent;
    return metodo === MetodoConsulta.Reconsulta;
  }),
  observaciones: yup.string().required("Requerido"),
});
