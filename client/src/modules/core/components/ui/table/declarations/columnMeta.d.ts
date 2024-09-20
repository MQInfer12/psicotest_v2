import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    minWidth?: number;
    width?: number;
    textAlign?: "start" | "center";
    minimal?: boolean;
  }
}
