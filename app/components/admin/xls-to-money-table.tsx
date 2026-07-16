"use client";

import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  CMS_XLS_COLUMNS,
  CMS_XLS_ROWS_STORAGE_KEY,
  createEmptyCmsWithdrawalRow,
  parseCmsAmount,
  type CmsWithdrawalRow,
} from "~/lib/cms-xls";

function readStoredRows(): CmsWithdrawalRow[] {
  if (typeof window === "undefined") return [];

  const raw = sessionStorage.getItem(CMS_XLS_ROWS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as CmsWithdrawalRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type ImportActionData =
  | { error: string }
  | { success: true; inserted: number };

export function XlsToMoneyTable() {
  const fetcher = useFetcher<ImportActionData>();
  const [rows, setRows] = useState<CmsWithdrawalRow[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setRows(readStoredRows());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!rows.length) {
      sessionStorage.removeItem(CMS_XLS_ROWS_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(CMS_XLS_ROWS_STORAGE_KEY, JSON.stringify(rows));
  }, [ready, rows]);

  useEffect(() => {
    if (!fetcher.data) return;

    if ("error" in fetcher.data) {
      setMessage(fetcher.data.error);
      return;
    }

    if ("success" in fetcher.data) {
      setMessage(`${fetcher.data.inserted.toLocaleString("ko-KR")}건이 회비 내역에 입력되었습니다.`);
      setRows([]);
      sessionStorage.removeItem(CMS_XLS_ROWS_STORAGE_KEY);
    }
  }, [fetcher.data]);

  const updateCell = (
    rowIndex: number,
    key: keyof CmsWithdrawalRow,
    value: string,
  ) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex ? { ...row, [key]: value } : row,
      ),
    );
  };

  const addRow = () => {
    setRows((current) => [...current, createEmptyCmsWithdrawalRow()]);
  };

  const submitImport = () => {
    if (!rows.length) return;
    if (!confirm(`${rows.length.toLocaleString("ko-KR")}건을 yoga_payments에 입력할까요?`)) {
      return;
    }

    setMessage(null);
    fetcher.submit(
      {
        intent: "import",
        rows: JSON.stringify(rows),
      },
      { method: "post" },
    );
  };

  const totalAmount = rows.reduce(
    (sum, row) => sum + (parseCmsAmount(row.amount) || 0),
    0,
  );
  const isSubmitting = fetcher.state !== "idle";

  if (!ready) {
    return (
      <p className="rounded border bg-white px-4 py-8 text-center text-sm text-muted-foreground shadow-sm">
        데이터를 불러오는 중입니다.
      </p>
    );
  }

  if (!rows.length) {
    return (
      <div className="space-y-3">
        {message ? (
          <p className="rounded border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-800">
            {message}
          </p>
        ) : null}
        <p className="rounded border bg-white px-4 py-8 text-center text-sm text-muted-foreground shadow-sm">
          엑셀 파일을 업로드하면 출금 내역이 표시됩니다.
        </p>
      </div>
    );
  }

  const importButton = (
    <Button
      type="button"
      size="sm"
      onClick={submitImport}
      disabled={isSubmitting}
    >
      {isSubmitting ? "입력 중..." : "데이터입력"}
    </Button>
  );

  return (
    <div className="space-y-3">
      {message ? (
        <p
          className={
            fetcher.data && "error" in fetcher.data
              ? "rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
              : "rounded border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-800"
          }
        >
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          총 {rows.length.toLocaleString("ko-KR")}건 · 셀을 클릭해 수정할 수 있습니다.
        </p>
        {importButton}
      </div>

      <div className="overflow-x-auto rounded border bg-white shadow-sm">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="bg-sky-600 text-white">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">No</th>
              {CMS_XLS_COLUMNS.map((column) => (
                <th key={column.key} className="px-3 py-2 text-left font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                <td className="px-3 py-2 align-middle text-muted-foreground">
                  {rowIndex + 1}
                </td>
                {CMS_XLS_COLUMNS.map((column) => (
                  <td key={column.key} className="px-2 py-1.5 align-middle">
                    <Input
                      value={row[column.key]}
                      onChange={(event) =>
                        updateCell(rowIndex, column.key, event.target.value)
                      }
                      className="min-w-[96px]"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t bg-slate-50 font-semibold">
              <td className="px-3 py-3" colSpan={CMS_XLS_COLUMNS.length}>
                합계건수 {rows.length.toLocaleString("ko-KR")}건
              </td>
              <td className="px-3 py-3 text-right whitespace-nowrap">
                합계금액 {totalAmount.toLocaleString("ko-KR")}원
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={addRow}
          className="text-sm text-sky-700 underline-offset-4 hover:underline"
        >
          행 추가
        </button>
        {importButton}
      </div>
    </div>
  );
}
