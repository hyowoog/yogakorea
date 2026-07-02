import type { Route } from "./+types/admin.licenses.api.$id";
import { useEffect } from "react";
import { data, useNavigate } from "react-router";
import { requireAdmin } from "~/lib/auth.server";
import {
  deleteLicense,
  getLicense,
  parseLicenseFormData,
  updateLicense,
} from "~/lib/yoga-license.server";

async function loadLicenseDetail(db: D1Database, id: number) {
  const license = await getLicense(db, id);
  if (!license) {
    throw data("자격증을 찾을 수 없습니다.", { status: 404 });
  }
  return { license };
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const id = parseInt(params.id ?? "", 10);
  if (!id) throw data("자격증을 찾을 수 없습니다.", { status: 404 });

  return loadLicenseDetail(context.cloudflare.env.DB, id);
}

export async function action({ params, request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const id = parseInt(params.id ?? "", 10);
  if (!id) return data({ error: "자격증을 찾을 수 없습니다." }, { status: 400 });

  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "update") {
    const parsed = parseLicenseFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    await updateLicense(db, id, parsed.input);
    return loadLicenseDetail(db, id);
  }

  if (intent === "delete") {
    await deleteLicense(db, id);
    return data({ deleted: true });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminLicenseApiRedirect({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const id = params.id;

  useEffect(() => {
    if (id) {
      navigate(`/admin/licenses?detail=${id}`, { replace: true });
    } else {
      navigate("/admin/licenses", { replace: true });
    }
  }, [id, navigate]);

  return null;
}
