import type { Route } from "./+types/admin.tshirts.export";
import { data } from "react-router";
import { requireAdmin } from "~/lib/auth.server";
import { buildTshirtOrdersCsv, listTshirtOrders } from "~/lib/tshirt.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const orders = await listTshirtOrders(context.cloudflare.env.DB);
  const { csv, filename } = buildTshirtOrdersCsv(orders);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
    },
  });
}
