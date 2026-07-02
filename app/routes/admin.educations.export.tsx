import type { Route } from "./+types/admin.educations.export";
import { requireAdmin } from "~/lib/auth.server";
import { csvResponse } from "~/lib/csv.server";
import {
  buildEducationsCsv,
  listEducationsForExport,
  parseEducationFilters,
} from "~/lib/yoga-education.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const url = new URL(request.url);
  const filters = parseEducationFilters(url.searchParams);
  const educations = await listEducationsForExport(context.cloudflare.env.DB, filters);
  const { csv, filename } = buildEducationsCsv(educations);
  return csvResponse(csv, filename);
}
