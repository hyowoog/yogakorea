import type { Route } from "./+types/admin.licenses.export";
import { requireAdmin } from "~/lib/auth.server";
import { csvResponse } from "~/lib/csv.server";
import {
  buildLicensesCsv,
  listLicensesForExport,
  parseLicenseFilters,
} from "~/lib/yoga-license.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const url = new URL(request.url);
  const filters = parseLicenseFilters(url.searchParams);
  const licenses = await listLicensesForExport(context.cloudflare.env.DB, filters);
  const { csv, filename } = buildLicensesCsv(licenses);
  return csvResponse(csv, filename);
}
