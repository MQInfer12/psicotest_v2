import dayjs from "dayjs";
import * as yup from "yup";

export const AppointmentDTOSchema = yup.object({
  fecha: yup
    .string()
    .required("Requerido")
    .test(
      "is-not-past-date",
      "La fecha no puede ser anterior a la de hoy",
      (value) => {
        const dateThreshold = dayjs().startOf("day");
        const inputDate = dayjs(value);
        return (
          inputDate.isSame(dateThreshold) || inputDate.isAfter(dateThreshold)
        );
      }
    )
    .test(
      "is-not-past-appointment-date",
      "La fecha no puede ser anterior a la de la cita",
      (value, { options: { context } }) => {
        if (!context) return true;
        const { fechaCita } = context as { fechaCita: string };
        if (!fechaCita) return true;
        const dateThreshold = dayjs(fechaCita).startOf("day");
        const inputDate = dayjs(value);
        return (
          inputDate.isSame(dateThreshold) || inputDate.isAfter(dateThreshold)
        );
      }
    ),
  id_horario: yup.number().typeError("Requerido").required("Requerido"),
  email_paciente: yup.string(),
});
