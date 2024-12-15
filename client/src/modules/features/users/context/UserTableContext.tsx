import { createContext, useContext } from "react";
import { Rol } from "../../rol/api/responses";

export type UserTableFiltersType =
  | "nombre"
  | "email"
  | "genero"
  | "estado"
  | "rol";

export interface UserTableFiltersState {
  type: UserTableFiltersType;
  value: string;
}

interface Ctx {
  roles: Rol[] | undefined;
  filters: UserTableFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<UserTableFiltersState>>;
}

const UserTableContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
  value: Ctx;
}

export const UserTableContextProvider = ({ children, value }: Props) => {
  return (
    <UserTableContext.Provider value={value}>{children}</UserTableContext.Provider>
  );
};

export const useUserTableContext = () => {
  const context = useContext(UserTableContext);
  if (!context) {
    throw new Error(
      "this contexts must be used whitin a UserTableContextProvider"
    );
  }
  return context;
};
