import * as yup from "yup";
import dayjs from "dayjs";

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
        const today = dayjs().startOf("day");
        const inputDate = dayjs(value);
        return inputDate.isSame(today) || inputDate.isAfter(today);
      }
    ),
  id_horario: yup.number().typeError("Requerido").required("Requerido"),
});
