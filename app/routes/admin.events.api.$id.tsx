import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/admin.events.api.$id";

export { loader, action } from "./admin.events.api.$id.server";

export default function AdminEventApiRedirect({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const id = params.id;

  useEffect(() => {
    if (id) {
      navigate(`/admin/events?detail=${id}`, { replace: true });
    } else {
      navigate("/admin/events", { replace: true });
    }
  }, [id, navigate]);

  return null;
}
