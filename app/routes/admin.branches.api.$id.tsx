import type { Route } from "./+types/admin.branches.api.$id";
import { useEffect } from "react";
import { data, useNavigate } from "react-router";
import { requireAdmin } from "~/lib/auth.server";
import {
  deleteBranch,
  getBranch,
  parseBranchFormData,
  updateBranch,
} from "~/lib/yoga-branch.server";

async function loadBranchDetail(db: D1Database, id: number) {
  const branch = await getBranch(db, id);
  if (!branch) {
    throw data("요가원을 찾을 수 없습니다.", { status: 404 });
  }
  return { branch };
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const id = parseInt(params.id ?? "", 10);
  if (!id) throw data("요가원을 찾을 수 없습니다.", { status: 404 });

  return loadBranchDetail(context.cloudflare.env.DB, id);
}

export async function action({ params, request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const id = parseInt(params.id ?? "", 10);
  if (!id) return data({ error: "요가원을 찾을 수 없습니다." }, { status: 400 });

  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "update") {
    const parsed = parseBranchFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    await updateBranch(db, id, parsed.input);
    return loadBranchDetail(db, id);
  }

  if (intent === "delete") {
    await deleteBranch(db, id);
    return data({ deleted: true });
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminBranchApiRedirect({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const id = params.id;

  useEffect(() => {
    if (id) {
      navigate(`/admin/branches?detail=${id}`, { replace: true });
    } else {
      navigate("/admin/branches", { replace: true });
    }
  }, [id, navigate]);

  return null;
}
