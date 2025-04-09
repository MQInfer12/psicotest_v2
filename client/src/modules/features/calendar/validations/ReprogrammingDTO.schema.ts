import * as yup from "yup";

export const ReprogrammingDTOSchema = yup.object({
  descripcion: yup.string().required("Requerido"),
  fecha: yup
    .string()
    .required("Requerido")
    .test(
      "is-not-past-date",
      "La fecha no puede ser anterior a la de hoy",
      (value) => {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of the day
        const inputDate = new Date(value);
        return inputDate >= today;
      }
    ),
  id_horario: yup.number().typeError("Requerido").required("Requerido"),
});
