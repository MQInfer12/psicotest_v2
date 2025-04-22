import { createContext, useContext } from "react";

export type PatientTableFiltersType = "nombre" | "email" | "genero" | "carrera";

export interface PatientTableFiltersState {
  type: PatientTableFiltersType;
  value: string;
}

interface Ctx {
  filters: PatientTableFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<PatientTableFiltersState>>;
  showMine: boolean;
  setShowMine: React.Dispatch<React.SetStateAction<boolean>>;
}

const PatientTableContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
  value: Ctx;
}

export const PatientTableContextProvider = ({ children, value }: Props) => {
  return (
    <PatientTableContext.Provider value={value}>
      {children}
    </PatientTableContext.Provider>
  );
};

export const usePatientTableContext = () => {
  const context = useContext(PatientTableContext);
  if (!context) {
    throw new Error(
      "this contexts must be used whitin a PatientTableContextProvider"
    );
  }
  return context;
};
