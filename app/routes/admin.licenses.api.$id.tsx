import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/admin.licenses.api.$id";

export { loader, action } from "./admin.licenses.api.$id.server";

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
