import Loader from "@/modules/core/components/ui/loader/Loader";
import { fetchOptions } from "@/modules/core/hooks/useFetch/utils/fetchFn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import React, { createContext, useContext, useState } from "react";
import { TestForm } from "../../tests/api/dtos";
import { T_Test_Respuesta } from "../../tests/api/responses";
import { TestType } from "../../tests/types/TestType";
import { useLastFocused } from "../hooks/useLastFocused";

interface Ctx {
  data: T_Test_Respuesta;
  test: TestType;
  resultados: TestForm[];
  setResultados: React.Dispatch<React.SetStateAction<TestForm[]>>;
  interpretation: string | null;
  setInterpretation: React.Dispatch<React.SetStateAction<string | null>>;
  seccionIndex: number;
  setSeccionIndex: React.Dispatch<React.SetStateAction<number>>;
}

const AnswerContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
}

export const AnswerContextProvider = ({ children }: Props) => {
  const { id } = useParams({
    from: "/_private/answers/$id",
  });

  const {
    data: { data },
  } = useSuspenseQuery(
    //@ts-expect-error NO SE QUE DICE EL ERROR
    // TODO: ARREGLAR ESTE ERROR QUITAR EL EXPECT ERROR
    fetchOptions(
      [
        "GET /test/for/respuesta/:id",
        {
          id: Number(id),
        },
      ],
      {},
      {
        gcTime: 0,
      }
    )
  );

  const { saveLastFocused } = useLastFocused();
  saveLastFocused(data && [data.id_respuesta]);

  const [interpretation, setInterpretation] = useState(data.interpretacion);
  const [seccionIndex, setSeccionIndex] = useState(0);

  if (!data) {
    return (
      <div className="w-full h-full">
        <Loader text="Cargando respuesta..." />
      </div>
    );
  }

  const test: TestType = data && JSON.parse(data.test);

  const [resultados, setResultados] = useState(
    data.resultados ? JSON.parse(data.resultados) : []
  );

  return (
    <AnswerContext.Provider
      value={{
        data,
        test,
        resultados,
        setResultados,
        interpretation,
        setInterpretation,
        seccionIndex,
        setSeccionIndex,
      }}
    >
      {children}
    </AnswerContext.Provider>
  );
};

export const useAnswerContext = () => {
  const context = useContext(AnswerContext);
  if (!context) {
    throw new Error(
      "this contexts must be used whitin a AnswerContextProvider"
    );
  }
  return context;
};
