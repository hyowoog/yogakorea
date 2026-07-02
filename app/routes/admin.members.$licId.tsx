import type { Route } from "./+types/admin.members.$licId";
import { redirect } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const licId = params.licId;
  if (!licId) throw redirect("/admin/members");
  throw redirect(`/admin/members?detail=${licId}`);
}
