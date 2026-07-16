import type { Route } from "./+types/admin.xls-to-money.upload";
import { data, Form, Link } from "react-router";
import { XlsToMoneyUploadRedirect } from "~/components/admin/xls-to-money-upload-redirect";
import { AdminLayout } from "~/components/admin/admin-layout";
import { Button } from "~/components/ui/button";
import type { CmsWithdrawalRow } from "~/lib/cms-xls";
import {
  isSupportedCmsXlsFileName,
  parseCmsWithdrawalXls,
} from "~/lib/cms-xls.server";
import { requireAdmin } from "~/lib/auth.server";
import { mainNavigation } from "~/lib/navigation";

export function meta() {
  return [{ title: "엑셀 업로드 - 회비입금처리 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return data({ error: "엑셀 파일을 선택해 주세요." }, { status: 400 });
  }

  if (!isSupportedCmsXlsFileName(file.name)) {
    return data({ error: "xls 또는 xlsx 파일만 업로드할 수 있습니다." }, { status: 400 });
  }

  try {
    const rows = parseCmsWithdrawalXls(await file.arrayBuffer());
    return data({ rows, rowCount: rows.length } satisfies {
      rows: CmsWithdrawalRow[];
      rowCount: number;
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "엑셀 파일을 처리하지 못했습니다.";
    return data({ error: message }, { status: 400 });
  }
}

export default function AdminXlsToMoneyUpload({
  actionData,
}: Route.ComponentProps) {
  const rows =
    actionData && "rows" in actionData && Array.isArray(actionData.rows)
      ? actionData.rows
      : null;

  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="엑셀 업로드"
      title="엑셀 업로드"
      description="CMS 출금 내역 엑셀 파일을 업로드합니다."
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/xls-to-money">목록으로</Link>
        </Button>
      }
    >
      <XlsToMoneyUploadRedirect rows={rows} />

      {actionData && "error" in actionData ? (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {actionData.error}
        </p>
      ) : null}

      <section className="max-w-xl rounded border bg-white p-6 shadow-sm">
        <Form method="post" encType="multipart/form-data" className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              엑셀 파일
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              required
              className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-sky-700"
            />
            <p className="text-xs text-muted-foreground">
              CMS에서 다운로드한 xls, xlsx 파일을 선택하세요. 업로드 후 파일은 저장하지
              않습니다.
            </p>
          </div>
          <Button type="submit">업로드</Button>
        </Form>
      </section>
    </AdminLayout>
  );
}
