import * as yup from "yup";

export const TextSectionDTOSchema = yup.object({
  word: yup
    .string()
    .required("Requerido")
    .test(
      "single-word",
      "Una palabra a la vez",
      (value) => value?.trim().split(/\s+/).length === 1
    )
    .matches(/^\s*[a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s*$/, "Palabra inválida"),
});

export type TextSectionDTO = yup.InferType<typeof TextSectionDTOSchema>;
