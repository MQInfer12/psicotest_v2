import { flexRender, Table } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React, { CSSProperties, useEffect } from "react";
import Button from "../Button";
import Loader from "../loader/Loader";
import { TableAction } from "./Table";

interface Props<T> {
  data: T[] | undefined;
  rowHeight: number;
  savedOffsetKey?: string;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  table: Table<T>;
  onClickRow?: {
    fn: (row: T) => void;
    disabled?: (row: T) => boolean;
  };
  rowStyle?: (row: T) => CSSProperties;
  gridTemplateColumns: string;
  actions?: TableAction<T>[];
  loadingRow?: (row: T) => boolean;
  checkable?: boolean;
}

const TableRows = <T,>({
  savedOffsetKey,
  rowHeight,
  tableContainerRef,
  data,
  table,
  onClickRow,
  rowStyle,
  gridTemplateColumns,
  actions,
  checkable,
  loadingRow,
}: Props<T>) => {
  const rowVirtualizer = useVirtualizer({
    initialOffset: () => {
      if (!savedOffsetKey) return 0;
      const initialOffset = sessionStorage.getItem(savedOffsetKey);
      return initialOffset ? Number(initialOffset) : 0;
    },
    count: data?.length ?? 0,
    estimateSize: () => rowHeight,
    getScrollElement: () => tableContainerRef.current,
    overscan: 2,
  });

  useEffect(() => {
    return () => {
      if (!savedOffsetKey) return;
      const offset = rowVirtualizer.scrollOffset;
      if (offset) {
        sessionStorage.setItem(savedOffsetKey, String(offset));
      }
    };
  }, [savedOffsetKey]);

  return (
    <tbody
      className="relative"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = table.getRowModel().rows[virtualRow.index];
        const handleClickRow = onClickRow?.disabled
          ? onClickRow?.disabled(row.original)
            ? undefined
            : onClickRow.fn
          : onClickRow?.fn;
        const styles = rowStyle?.(row.original) || {};
        return (
          <tr
            className={clsx(
              "absolute w-full grid border-b border-b-alto-100 transition-[background-color,opacity,filter] duration-300",
              {
                "bg-white": virtualRow.index % 2 === 0,
                "bg-primary-50": virtualRow.index % 2 === 1,
                "hover:!invert-[4%] cursor-pointer": !!handleClickRow,
              }
            )}
            style={{
              gridTemplateColumns,
              transform: `translateY(${virtualRow.start}px)`,
              ...styles,
            }}
            onClick={() => handleClickRow?.(row.original)}
            key={row.id}
          >
            {checkable && (
              <td
                style={{
                  height: rowHeight,
                }}
                className="flex items-center justify-center text-[10px] overflow-hidden text-ellipsis"
                onClick={row.getToggleSelectedHandler()}
              >
                <input
                  className="accent-primary-500"
                  type="checkbox"
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onChange={() => {}}
                />
              </td>
            )}
            <td
              style={{
                height: rowHeight,
              }}
              className="flex items-center justify-center text-[10px] overflow-hidden text-ellipsis"
            >
              {virtualRow.index + 1}
            </td>
            {row.getVisibleCells().map((cell) => {
              const content = flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              );
              return (
                <td
                  key={cell.id}
                  style={{
                    height: rowHeight,
                  }}
                  className={clsx(
                    "flex items-center text-xs px-3 [&_p]:overflow-hidden [&_p]:text-ellipsis w-full",
                    {
                      "justify-center":
                        cell.column.columnDef.meta?.textAlign === "center",
                    }
                  )}
                >
                  {content}
                </td>
              );
            })}
            {actions && (
              <td
                style={{
                  height: rowHeight,
                }}
                className="flex items-center justify-center px-3 w-full gap-1"
              >
                {loadingRow?.(row.original) ? (
                  <div className="-mt-6">
                    <Loader text="" scale=".4" />
                  </div>
                ) : (
                  actions.map((a) => (
                    <Button
                      key={a.title}
                      onClick={() => a.fn(row.original)}
                      btnSize="small"
                      title={a.title}
                      icon={a.icon}
                      disabled={a.disabled?.(row.original)}
                      btnType={a.type}
                      danger={a.danger}
                    />
                  ))
                )}
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableRows;
