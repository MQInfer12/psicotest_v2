import dayjs from "dayjs";
import * as yup from "yup";

export const OcuppationDTOSchema = yup.object({
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
  hora_inicio: yup.string().required("Requerido"),
  hora_final: yup
    .string()
    .required("Requerido")
    .test(
      "is-after-start-time",
      "No menor a la hora de inicio",
      function (value) {
        const { fecha, hora_inicio } = this.parent;
        if (!hora_inicio || !value || !fecha) return false;
        return dayjs(fecha + " " + value).isAfter(
          dayjs(fecha + " " + hora_inicio)
        );
      }
    ),
});
