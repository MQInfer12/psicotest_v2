import * as yup from "yup";

export const ScheduleDTOSchema = yup.object({
  dia: yup.number().typeError("Ingresa un día válido").required(),
  hora_inicio: yup.string().required("Hora de inicio es requerida"),
  minutos: yup.number().typeError("Ingresa un número válido").required(),
  tipo: yup.string().required("Tipo es requerido"),
});
