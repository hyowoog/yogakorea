import { redirect } from "react-router";

export function loader() {
  return redirect("/board/branch");
}

export default function BranchAlias() {
  return null;
}

