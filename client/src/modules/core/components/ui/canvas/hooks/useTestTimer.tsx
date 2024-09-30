import { Item, Seccion } from "@/modules/features/tests/types/TestType";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const useTestTimer = (
  preguntaIndex: number,
  setPreguntaIndex: (newPage: number, newDirection: number) => void,
  preguntas: Item[],
  secciones: Seccion[],
  seccion: Seccion | undefined,
  open: boolean,
  viewSection: boolean,
  prev: boolean
) => {
  const [timer, setTimer] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!viewSection && open && timer) {
      intervalRef.current = setInterval(() => setTimer(timer - 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [viewSection, open, timer]);

  useLayoutEffect(() => {
    if (!prev) {
      setTimer(seccion?.timer || null);
    }
  }, [seccion]);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(intervalRef.current);
      setPreguntaIndex(preguntaIndex, 1);
    }
  }, [timer]);

  const seccionIndex = secciones.findIndex((s) => s.id === seccion?.id);
  const newSeccion =
    seccionIndex === secciones.length - 1 ? null : secciones[seccionIndex + 1];

  const goToNextSection = () => {
    if (newSeccion) {
      if (newSeccion.items.length > 0) {
        const firstQuestionIndex = preguntas.findIndex(
          (p) => p.id === newSeccion.items[0].id
        );
        setPreguntaIndex(firstQuestionIndex, 1);
      }
    }
  };

  const isLastSection = newSeccion === null;

  return { timer, isLastSection, goToNextSection };
};
