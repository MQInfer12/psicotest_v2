import * as yup from "yup";

export const App_ConfiguracionFormSchema = yup.object({
  gpt_key: yup.string(),
  gpt_model: yup.string().required("El modelo es requerido"),
});
