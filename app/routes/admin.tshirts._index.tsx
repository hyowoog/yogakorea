import type { Route } from "./+types/admin.tshirts._index";
import { data, Form, Link, redirect } from "react-router";
import { AdminLayout } from "~/components/admin/admin-layout";
import { AdminRowEdit } from "~/components/admin/admin-row-edit";
import { TshirtOrderForm } from "~/components/tshirt/tshirt-order-form";
import { Button } from "~/components/ui/button";
import { requireAdmin } from "~/lib/auth.server";
import { formatTshirtColor, formatTshirtSize } from "~/lib/tshirt-constants";
import {
  createTshirtOrder,
  deleteTshirtOrder,
  listTshirtOrders,
  parseTshirtFormData,
  updateTshirtOrder,
} from "~/lib/tshirt.server";
import { mainNavigation } from "~/lib/navigation";

export function meta() {
  return [{ title: "티셔츠 신청 관리 - 한국요가연합회" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const orders = await listTshirtOrders(context.cloudflare.env.DB);
  return { orders };
}

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "create" || intent === "update") {
    const parsed = parseTshirtFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }

    if (intent === "create") {
      await createTshirtOrder(db, parsed.input);
    } else {
      const orderId = parseInt(String(formData.get("orderId") ?? ""), 10);
      if (!orderId) return data({ error: "수정할 신청을 찾을 수 없습니다." }, { status: 400 });
      await updateTshirtOrder(db, orderId, parsed.input);
    }
    return redirect("/admin/tshirts");
  }

  if (intent === "delete") {
    const orderId = parseInt(String(formData.get("orderId") ?? ""), 10);
    if (!orderId) return data({ error: "삭제할 신청을 찾을 수 없습니다." }, { status: 400 });
    await deleteTshirtOrder(db, orderId);
    return redirect("/admin/tshirts");
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminTshirtsIndex({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { orders } = loaderData;

  return (
    <AdminLayout
      navigation={mainNavigation}
      pageTitle="티셔츠 신청 관리"
      title="티셔츠 신청 현황"
      description="이름순으로 정렬됩니다."
      actions={
        <Button asChild variant="outline" size="sm">
          <a href="/admin/tshirts/export">엑셀저장</a>
        </Button>
      }
    >

        {actionData && "error" in actionData ? (
          <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {actionData.error}
          </p>
        ) : null}

        <div className="overflow-x-auto rounded border bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-sky-600 text-white">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">순번</th>
                <th className="px-3 py-2 text-left font-semibold">이름</th>
                <th className="px-3 py-2 text-left font-semibold">휴대전화</th>
                <th className="px-3 py-2 text-left font-semibold">색상</th>
                <th className="px-3 py-2 text-left font-semibold">사이즈</th>
                <th className="px-3 py-2 text-left font-semibold">요가원명</th>
                <th className="px-3 py-2 text-left font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className="border-t">
                  <td className="px-3 py-3 align-middle">{index + 1}</td>
                  <td className="px-3 py-3 align-middle">{order.name}</td>
                  <td className="px-3 py-3 align-middle">{order.mobile}</td>
                  <td className="px-3 py-3 align-middle">{formatTshirtColor(order.color)}</td>
                  <td className="px-3 py-3 align-middle">
                    {formatTshirtSize(order.id, order.size_code)}
                  </td>
                  <td className="px-3 py-3 align-middle">{order.studio_name}</td>
                  <td className="px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <AdminRowEdit panelClassName="min-w-[320px]">
                        <TshirtOrderForm intent="update" order={order} />
                      </AdminRowEdit>
                      <Form
                        method="post"
                        onSubmit={(event) => {
                          if (!confirm("정말 삭제하시겠습니까?"))
                            event.preventDefault();
                        }}
                      >
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="orderId" value={order.id} />
                        <Button type="submit" size="sm" variant="destructive">
                          삭제
                        </Button>
                      </Form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="rounded border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">신청 추가</h2>
          <TshirtOrderForm intent="create" />
        </section>
    </AdminLayout>
  );
}
