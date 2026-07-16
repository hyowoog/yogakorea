"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router";
import { CMS_XLS_ROWS_STORAGE_KEY, type CmsWithdrawalRow } from "~/lib/cms-xls";

interface XlsToMoneyUploadRedirectProps {
  rows: CmsWithdrawalRow[] | null;
}

export function XlsToMoneyUploadRedirect({ rows }: XlsToMoneyUploadRedirectProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!rows?.length) return;

    sessionStorage.setItem(CMS_XLS_ROWS_STORAGE_KEY, JSON.stringify(rows));
    navigate("/admin/xls-to-money", { replace: true });
  }, [navigate, rows]);

  if (!rows?.length) return null;

  return (
    <p className="rounded border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-800">
      {rows.length.toLocaleString("ko-KR")}건을 불러오는 중입니다...
    </p>
  );
}
