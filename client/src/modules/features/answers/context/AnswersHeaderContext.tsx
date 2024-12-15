import { createContext, useContext } from "react";
import { IA_Plantilla } from "../../templates/api/responses";
import { T_Tests_Respuestas } from "../../tests/api/responses";
import { SetData } from "@/modules/core/hooks/useFetch/getSetData";
import { Refetch } from "@/modules/core/types/ReactQuery";

export type AnswersTableFiltersType = "nombre" | "test";

export interface AnswersTableFilters {
  type: AnswersTableFiltersType;
  value: string;
}

export interface SelectedTests {
  user: {
    nombre: string;
    email: string;
    fechaNacimiento: string | null;
    fechaEnviado: string;
  };
  selecteds: {
    id_respuesta: number;
    id_test: number;
    nombre_test: string;
    nombre_carpeta: string;
  }[];
}

interface Ctx {
  filters: AnswersTableFilters;
  setFilters: React.Dispatch<React.SetStateAction<AnswersTableFilters>>;
  selectedTests: SelectedTests | null;
  setSelectedTests: React.Dispatch<React.SetStateAction<SelectedTests | null>>;
  startedSelection: IA_Plantilla | null;
  setStartedSelection: React.Dispatch<
    React.SetStateAction<IA_Plantilla | null>
  >;
  disableFilters: boolean;
  setData: SetData<T_Tests_Respuestas[]>;
  plantilla: string;
  setPlantilla: React.Dispatch<React.SetStateAction<string>>;
  refetch: Refetch<T_Tests_Respuestas[]>;
}

const AnswersHeaderContext = createContext<Ctx | null>(null);

interface Props extends Ctx {
  children: React.ReactNode;
}

export const AnswersHeaderContextProvider = ({ children, ...rest }: Props) => {
  return (
    <AnswersHeaderContext.Provider value={rest}>
      {children}
    </AnswersHeaderContext.Provider>
  );
};

export const useAnswersHeaderContext = () => {
  const context = useContext(AnswersHeaderContext);
  if (!context) {
    throw new Error(
      "this contexts must be used whitin a AnswersHeaderContextProvider"
    );
  }
  return context;
};
