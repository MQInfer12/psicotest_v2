import { useUserContext } from "@/modules/features/auth/context/UserContext";
import {
  Item,
  Requirements,
  TestType,
} from "@/modules/features/tests/types/TestType";
import { useMemo } from "react";

export const useTestActual = (test: TestType, preguntaIndex: number) => {
  const { user } = useUserContext();

  const requirements = test.requerimientos.filter((r) => {
    switch (r) {
      case Requirements.EDAD:
        return !user?.fecha_nacimiento;
      case Requirements.GENERO:
        return !user?.genero;
      default:
        return true;
    }
  });

  const preguntas = useMemo(
    () =>
      test.secciones.reduce((total, seccion) => {
        seccion.items.forEach((i) => {
          total.push(i);
        });
        return total;
      }, [] as Item[]),
    [test]
  );

  const secciones = useMemo(() => test.secciones, [test]);

  const pregunta = preguntas[preguntaIndex];
  const seccion = test.secciones.find((seccion) =>
    seccion.items.some((item) => item.id === pregunta.id)
  );
  const opciones = seccion?.opciones || [];

return { preguntas, secciones, pregunta, seccion, opciones, requirements };
};