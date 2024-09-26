import { createContext, useContext } from "react";
import { T_Test } from "../../tests/api/responses";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useParams } from "@tanstack/react-router";
import { TestType } from "../../tests/types/TestType";
import { TestForm } from "../../tests/api/dtos";
import Loader from "@/modules/core/components/ui/loader/Loader";

interface Ctx {
  data: T_Test;
  test: TestType;
  resultados: TestForm[];
}

const AnswerContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
}

export const AnswerContextProvider = ({ children }: Props) => {
  const { id } = useParams({
    from: "/_private/answers/$id",
  });

  const { fetchData } = useFetch();
  const { data } = fetchData([
    "GET /test/by/respuesta/:id",
    {
      id: Number(id),
    },
  ]);

  if (!data) {
    return (
      <div className="w-full h-full">
        <Loader text="Cargando respuesta..." />
      </div>
    );
  }

  const test: TestType = data && JSON.parse(data.test);
  const resultados: TestForm[] = data.resultados
    ? JSON.parse(data.resultados)
    : [];

  return (
    <AnswerContext.Provider value={{ data, test, resultados }}>
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
