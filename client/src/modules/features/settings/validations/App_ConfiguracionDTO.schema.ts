import * as yup from "yup";

export const App_ConfiguracionDTOSchema = yup.object({
  gpt_model: yup.string().required("El modelo es requerido"),
});
