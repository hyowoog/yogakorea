import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/admin.educations.api.$id";

export { loader, action } from "./admin.educations.api.$id.server";

export default function AdminEducationApiRedirect({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const id = params.id;

  useEffect(() => {
    if (id) {
      navigate(`/admin/educations?detail=${id}`, { replace: true });
    } else {
      navigate("/admin/educations", { replace: true });
    }
  }, [id, navigate]);

  return null;
}
