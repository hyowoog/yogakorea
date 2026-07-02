import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
}

function getColumnId<TData, TValue>(
  column: ColumnDef<TData, TValue>,
  index: number,
) {
  if (column.id) return column.id;
  if ("accessorKey" in column && column.accessorKey) {
    return String(column.accessorKey);
  }
  return String(index);
}

function renderHeader<TData, TValue>(
  column: ColumnDef<TData, TValue>,
  index: number,
) {
  const header = column.header;
  if (typeof header === "function") {
    return header({
      column: {
        id: getColumnId(column, index),
        columnDef: column,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }
  return header ?? null;
}

function renderCell<TData, TValue>(
  column: ColumnDef<TData, TValue>,
  row: TData,
  rowIndex: number,
  columnIndex: number,
) {
  const cell = column.cell;
  if (typeof cell === "function") {
    return cell({
      row: {
        id: String(rowIndex),
        index: rowIndex,
        original: row,
        getValue: (key: string) => row[key as keyof TData],
      },
      column: {
        id: getColumnId(column, columnIndex),
        columnDef: column,
      },
      getValue: () => {
        if ("accessorKey" in column && column.accessorKey) {
          return row[column.accessorKey as keyof TData];
        }
      },
      renderValue: () => null,
      table: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  if ("accessorKey" in column && column.accessorKey) {
    return row[column.accessorKey as keyof TData] as ReactNode;
  }

  return null;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "등록된 데이터가 없습니다.",
}: DataTableProps<TData, TValue>) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={getColumnId(column, index)}>
                {renderHeader(column, index)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={getColumnId(column, columnIndex)}>
                    {renderCell(column, row, rowIndex, columnIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
