import type { Route } from "./+types/admin.members.api.$licId";
import { useEffect } from "react";
import { data, useNavigate } from "react-router";
import { requireAdmin } from "~/lib/auth.server";
import {
  createYogaPayment,
  deleteYogaPayment,
  getYogaMemberByLicId,
  listYogaPayments,
  parseYogaMemberFormData,
  updateYogaMember,
  updateYogaPayment,
} from "~/lib/yoga-member.server";

async function loadMemberDetail(db: D1Database, licId: number) {
  const [member, payments] = await Promise.all([
    getYogaMemberByLicId(db, licId),
    listYogaPayments(db, licId),
  ]);

  if (!member) {
    throw data("회원을 찾을 수 없습니다.", { status: 404 });
  }

  return { member, payments };
}

export async function loader({ params, request, context }: Route.LoaderArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const licId = parseInt(params.licId ?? "", 10);
  if (!licId) throw data("회원을 찾을 수 없습니다.", { status: 404 });

  return loadMemberDetail(context.cloudflare.env.DB, licId);
}

export async function action({ params, request, context }: Route.ActionArgs) {
  await requireAdmin(request, context.cloudflare.env.DB);
  const licId = parseInt(params.licId ?? "", 10);
  if (!licId) return data({ error: "회원을 찾을 수 없습니다." }, { status: 400 });

  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "update") {
    const parsed = parseYogaMemberFormData(formData);
    if (parsed.errors.length) {
      return data({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    await updateYogaMember(db, licId, parsed.input);
    return loadMemberDetail(db, licId);
  }

  if (intent === "pay_create") {
    const payDate = String(formData.get("payDate") ?? "").trim();
    const payYy = String(formData.get("payYy") ?? "").trim();
    const payAmount = parseInt(String(formData.get("payAmount") ?? "").replace(/,/g, ""), 10);
    const payEtc = String(formData.get("payEtc") ?? "").trim();
    if (!payDate || !payYy || Number.isNaN(payAmount)) {
      return data({ error: "회비 정보를 확인해 주세요." }, { status: 400 });
    }
    await createYogaPayment(db, { licId, payDate, payAmount, payYy, payEtc });
    return loadMemberDetail(db, licId);
  }

  if (intent === "pay_update") {
    const paymentId = parseInt(String(formData.get("paymentId") ?? ""), 10);
    const payDate = String(formData.get("payDate") ?? "").trim();
    const payYy = String(formData.get("payYy") ?? "").trim();
    const payAmount = parseInt(String(formData.get("payAmount") ?? "").replace(/,/g, ""), 10);
    const payEtc = String(formData.get("payEtc") ?? "").trim();
    if (!paymentId || !payDate || !payYy || Number.isNaN(payAmount)) {
      return data({ error: "회비 정보를 확인해 주세요." }, { status: 400 });
    }
    await updateYogaPayment(db, paymentId, { payDate, payAmount, payYy, payEtc });
    return loadMemberDetail(db, licId);
  }

  if (intent === "pay_delete") {
    const paymentId = parseInt(String(formData.get("paymentId") ?? ""), 10);
    if (!paymentId) return data({ error: "삭제할 회비를 찾을 수 없습니다." }, { status: 400 });
    await deleteYogaPayment(db, paymentId);
    return loadMemberDetail(db, licId);
  }

  return data({ error: "잘못된 요청입니다." }, { status: 400 });
}

export default function AdminMemberApiRedirect({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const licId = params.licId;

  useEffect(() => {
    if (licId) {
      navigate(`/admin/members?detail=${licId}`, { replace: true });
    } else {
      navigate("/admin/members", { replace: true });
    }
  }, [licId, navigate]);

  return null;
}
