import type { Route } from "./+types/admin.xls-to-money._index";
import { data, Link } from "react-router";
import { XlsToMoneyTable } from "~/components/admin/xls-to-money-table";
import { AdminLayout } from "~/components/admin/admin-layout";
import { Button } from "~/components/ui/button";
import { requireAdmin } from "~/lib/auth.server";
import { cmsRowsToPaymentInputs, type CmsWithdrawalRow } from "~/lib/cms-xls";
import { createYogaPaymentsBatch } from "~/lib/yoga-member.server";
import { mainNavigation } from "~/lib/navigation";

export function meta() {
  return [{ title: "회비입금처리 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent !== "import") {
    return data({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  let rows: CmsWithdrawalRow[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("rows") ?? "[]"));
    if (!Array.isArray(parsed)) throw new Error("invalid");
    rows = parsed as CmsWithdrawalRow[];
  } catch {
    return data({ error: "입력할 데이터를 읽을 수 없습니다." }, { status: 400 });
  }

  if (!rows.length) {
    return data({ error: "입력할 데이터가 없습니다." }, { status: 400 });
  }

  const mapped = cmsRowsToPaymentInputs(rows);
  if (!mapped.ok) {
    return data({ error: mapped.error }, { status: 400 });
  }

  const inserted = await createYogaPaymentsBatch(
    context.cloudflare.env.DB,
    mapped.inputs,
  );

  return data({ success: true, inserted });
}

export default function AdminXlsToMoney() {
  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="회비입금처리"
      title="회비입금처리"
      description="엑셀파일 업로드 후 입금처리"
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/xls-to-money/upload">엑셀업로드</Link>
        </Button>
      }
    >
      <XlsToMoneyTable />
    </AdminLayout>
  );
}
