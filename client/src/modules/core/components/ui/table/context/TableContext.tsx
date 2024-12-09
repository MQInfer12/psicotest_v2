import { createContext, useContext } from "react";

interface Ctx {
  selectedRows: string[];
  resetSelectedRows: () => void;
}

const TableContext = createContext<Ctx | null>(null);

interface Props {
  value: Ctx;
  children: React.ReactNode;
}

export const TableContextProvider = ({ children, value }: Props) => {
  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("this contexts must be used whitin a TableContextProvider");
  }
  return context;
};
