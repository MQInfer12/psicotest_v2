import { createContext, useContext } from "react";

export type AppointmentPassedFiltersType = "nombre" | "fecha" | "estado";

export interface AppointmentPassedFiltersState {
  type: AppointmentPassedFiltersType;
  value: string;
}

interface Ctx {
  filters: AppointmentPassedFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<AppointmentPassedFiltersState>>;
}

const AppointmentPassedContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
  value: Ctx;
}

export const AppointmentPassedContextProvider = ({ children, value }: Props) => {
  return (
    <AppointmentPassedContext.Provider value={value}>
      {children}
    </AppointmentPassedContext.Provider>
  );
};

export const useAppointmentPassedContext = () => {
  const context = useContext(AppointmentPassedContext);
  if (!context) {
    throw new Error(
      "this contexts must be used whitin a AppointmentPassedContextProvider"
    );
  }
  return context;
};
