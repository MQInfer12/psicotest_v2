import {
  T_Test,
  T_Test_Respuesta,
  T_Tests,
  T_Tests_Respuestas,
} from "../api/responses";

export const isForResolveTests = (
  test: T_Tests | T_Tests_Respuestas
): test is T_Tests_Respuestas => {
  return "id_respuesta" in test;
};

export const isForResolveTest = (
  test: T_Test | T_Test_Respuesta
): test is T_Test_Respuesta => {
  return "id_respuesta" in test;
};
