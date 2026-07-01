import type { Route } from "./+types/api.upload";
import { data } from "react-router";
import { uploadToR2 } from "~/lib/r2.server";
import { getPublicUploadUrl } from "~/lib/files";

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "uploads");

  if (!(file instanceof File) || !file.size) {
    return data({ error: "파일이 없습니다." }, { status: 400 });
  }

  const uploaded = await uploadToR2(context.cloudflare.env.UPLOADS, file, folder);

  return {
    key: uploaded.key,
    url: getPublicUploadUrl(uploaded.key),
    fileName: uploaded.fileName,
  };
}
