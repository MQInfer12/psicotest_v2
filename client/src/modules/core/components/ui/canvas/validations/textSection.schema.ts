import * as yup from "yup";

export const TextSectionDTOSchema = yup.object({
  word: yup
    .string()
    .required("Requerido")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, "Palabra inválida"),
});

export type TextSectionDTO = yup.InferType<typeof TextSectionDTOSchema>;
