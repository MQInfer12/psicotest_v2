import * as yup from "yup";

export const CloseCaseDTOSchema = yup.object({
  motivo_cierre: yup.string().required("Campo requerido"),
  derivado_a: yup.string().test("isRequired", "Requerido", function (value) {
    const { motivo_cierre } = this.parent;
    return motivo_cierre === "Finalizado" || !!value?.trim();
  }),
  resumen: yup.string().test("isRequired", "Requerido", function (value) {
    const { motivo_cierre } = this.parent;
    return motivo_cierre === "Finalizado" || !!value?.trim();
  }),
});
