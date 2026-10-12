import type { Route } from "./+types/admin.payments.export";
import { requireAdmin } from "~/lib/auth.server";
import { csvResponse } from "~/lib/csv.server";
import {
  buildPaymentsCsv,
  listPaymentsForExport,
  parsePaymentFilters,
} from "~/lib/yoga-payment.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const url = new URL(request.url);
  const filters = parsePaymentFilters(url.searchParams);
  const payments = await listPaymentsForExport(context.cloudflare.env.DB, filters);
  const { csv, filename } = buildPaymentsCsv(payments);
  return csvResponse(csv, filename);
}
