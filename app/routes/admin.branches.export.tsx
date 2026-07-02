import type { Route } from "./+types/admin.branches.export";
import { requireAdmin } from "~/lib/auth.server";
import { csvResponse } from "~/lib/csv.server";
import {
  buildBranchesCsv,
  listBranchesForExport,
  parseBranchFilters,
} from "~/lib/yoga-branch.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const url = new URL(request.url);
  const filters = parseBranchFilters(url.searchParams);
  const branches = await listBranchesForExport(context.cloudflare.env.DB, filters);
  const { csv, filename } = buildBranchesCsv(branches);
  return csvResponse(csv, filename);
}
