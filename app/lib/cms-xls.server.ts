import * as XLSX from "xlsx";
import {
  CMS_XLS_COLUMNS,
  createEmptyCmsWithdrawalRow,
  type CmsWithdrawalRow,
} from "~/lib/cms-xls";

const HEADER_ALIASES: Record<keyof CmsWithdrawalRow, string[]> = {
  withdrawDate: ["출금신청일", "출금일"],
  payerNo: ["납부자번호"],
  licNo: ["자격번호", "회원번호"],
  area: ["권역", "지역"],
  payerName: ["납부자명", "성명", "이름"],
  billMonth: ["청구월차", "청구월", "월차"],
  agreementDate: ["약정일"],
  amount: ["출금액", "이체금액", "금액"],
};

function normalizeHeader(value: unknown) {
  return String(value ?? "")
    .replace(/\s+/g, "")
    .trim();
}

function cellValue(value: unknown) {
  if (value == null) return "";
  return String(value).trim();
}

function isEmptyRow(row: unknown[]) {
  return row.every((cell) => !cellValue(cell));
}

function isSummaryRow(row: unknown[]) {
  const joined = row.map(cellValue).join(" ");
  return /합계|총계|소계|total/i.test(joined);
}

function findHeaderRowIndex(matrix: unknown[][]) {
  return matrix.findIndex((row) => {
    const normalized = row.map(normalizeHeader);
    return normalized.some(
      (cell) => cell.includes("출금신청일") || cell.includes("납부자번호"),
    );
  });
}

function mapHeaderColumns(headerRow: unknown[]) {
  const normalized = headerRow.map(normalizeHeader);
  const columnIndex: Partial<Record<keyof CmsWithdrawalRow, number>> = {};

  for (const { key } of CMS_XLS_COLUMNS) {
    const aliases = HEADER_ALIASES[key];
    const index = normalized.findIndex((header) =>
      aliases.some((alias) => header.includes(alias.replace(/\s+/g, ""))),
    );
    if (index >= 0) columnIndex[key] = index;
  }

  return columnIndex;
}

function readRow(
  row: unknown[],
  columnIndex: Partial<Record<keyof CmsWithdrawalRow, number>>,
): CmsWithdrawalRow {
  const parsed = createEmptyCmsWithdrawalRow();

  for (const { key } of CMS_XLS_COLUMNS) {
    const index = columnIndex[key];
    parsed[key] = index == null ? "" : cellValue(row[index]);
  }

  return parsed;
}

function hasMeaningfulData(row: CmsWithdrawalRow) {
  return Object.values(row).some(Boolean);
}

export function parseCmsWithdrawalXls(buffer: ArrayBuffer): CmsWithdrawalRow[] {
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("엑셀 시트를 찾을 수 없습니다.");
  }

  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  if (!matrix.length) {
    throw new Error("엑셀 파일에 데이터가 없습니다.");
  }

  const headerRowIndex = findHeaderRowIndex(matrix);
  if (headerRowIndex < 0) {
    throw new Error("엑셀 헤더(출금신청일, 납부자번호 등)를 찾을 수 없습니다.");
  }

  const columnIndex = mapHeaderColumns(matrix[headerRowIndex] ?? []);
  if (columnIndex.payerNo == null && columnIndex.withdrawDate == null) {
    throw new Error("필수 열(출금신청일, 납부자번호)을 찾을 수 없습니다.");
  }

  const rows: CmsWithdrawalRow[] = [];
  for (const row of matrix.slice(headerRowIndex + 1)) {
    if (!Array.isArray(row) || isEmptyRow(row) || isSummaryRow(row)) continue;
    const parsed = readRow(row, columnIndex);
    if (hasMeaningfulData(parsed)) rows.push(parsed);
  }

  if (!rows.length) {
    throw new Error("엑셀에서 처리할 출금 내역을 찾을 수 없습니다.");
  }

  return rows;
}

export function isSupportedCmsXlsFileName(fileName: string) {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".xls") || lower.endsWith(".xlsx");
}
