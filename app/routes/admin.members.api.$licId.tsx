import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/admin.members.api.$licId";

export { loader, action } from "./admin.members.api.$licId.server";

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
