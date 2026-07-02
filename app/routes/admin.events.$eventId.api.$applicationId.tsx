import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/admin.events.$eventId.api.$applicationId";

export { loader, action } from "./admin.events.$eventId.api.$applicationId.server";

export default function AdminEventApplicationApiRedirect({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { eventId, applicationId } = params;

  useEffect(() => {
    if (eventId && applicationId) {
      navigate(`/admin/events/${eventId}?detail=${applicationId}`, { replace: true });
    } else if (eventId) {
      navigate(`/admin/events/${eventId}`, { replace: true });
    } else {
      navigate("/admin/events", { replace: true });
    }
  }, [eventId, applicationId, navigate]);

  return null;
}
