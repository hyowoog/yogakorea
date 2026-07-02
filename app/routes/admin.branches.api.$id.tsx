import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/admin.branches.api.$id";

export { loader, action } from "./admin.branches.api.$id.server";

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
