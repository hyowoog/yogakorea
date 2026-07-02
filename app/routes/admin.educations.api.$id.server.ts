import type { Route } from "./+types/admin.educations.api.$id";
import { data } from "react-router";
import { requireAdmin } from "~/lib/auth.server";
import {
  deleteEducation,
  getEducation,
  parseEducationFormData,
  updateEducation,
} from "~/lib/yoga-education.server";

async function loadEducationDetail(db: D1Database, id: number) {
  const education = await getEducation(db, id);
  if (!education) {
    throw data("교육이수 정보를 찾을 수 없습니다.", { status: 404 });
  }
  return { education };
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const id = parseInt(params.id ?? "", 10);
  if (!id) throw data("교육이수 정보를 찾을 수 없습니다.", { status: 404 });

  return loadEducationDetail(context.cloudflare.env.DB, id);
}

export async function action({ params, request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const id = parseInt(params.id ?? "", 10);
  if (!id) return data({ error: "교육이수 정보를 찾을 수 없습니다." }, { status: 400 });

  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "update") {
    const parsed = parseEducationFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    await updateEducation(db, id, parsed.input);
    return loadEducationDetail(db, id);
  }

  if (intent === "delete") {
    await deleteEducation(db, id);
    return data({ deleted: true });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

