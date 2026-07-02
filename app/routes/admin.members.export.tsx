import type { Route } from "./+types/admin.members.export";
import { requireAdmin } from "~/lib/auth.server";
import { csvResponse } from "~/lib/csv.server";
import {
  buildMembersCsv,
  listYogaMembersForExport,
  parseMemberFilters,
} from "~/lib/yoga-member.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const url = new URL(request.url);
  const filters = parseMemberFilters(url.searchParams);
  const members = await listYogaMembersForExport(context.cloudflare.env.DB, filters);
  const { csv, filename } = buildMembersCsv(members);
  return csvResponse(csv, filename);
}
