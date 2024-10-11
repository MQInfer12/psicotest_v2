import { createContext, useContext } from "react";
import { IA_Plantilla } from "../../templates/api/responses";

export type AnswersTableFiltersType = "nombre" | "test";

export interface AnswersTableFilters {
  type: AnswersTableFiltersType;
  value: string;
}

export interface SelectedTests {
  user: {
    nombre: string;
    email: string;
  };
  selecteds: {
    id_respuesta: number;
    id_test: number;
    nombre_test: string;
  }[];
}

interface Ctx {
  totalRows: number;
  filters: AnswersTableFilters;
  setFilters: React.Dispatch<React.SetStateAction<AnswersTableFilters>>;
  selectedTests: SelectedTests | null;
  setSelectedTests: React.Dispatch<React.SetStateAction<SelectedTests | null>>;
  startedSelection: IA_Plantilla | null;
  setStartedSelection: React.Dispatch<
    React.SetStateAction<IA_Plantilla | null>
  >;
  disableFilters: boolean;
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
