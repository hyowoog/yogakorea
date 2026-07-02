import type { Route } from "./+types/api.files.$";
import { readLegacyLocalFile, fetchLegacyRemoteFile } from "~/lib/legacy-files.server";
import { getR2Object } from "~/lib/r2.server";

export async function loader({ params, context }: Route.LoaderArgs) {
  const key = params["*"];
  if (!key) {
    return new Response("Not found", { status: 404 });
  }

  const decodedKey = decodeURIComponent(key);
  const object = await getR2Object(context.cloudflare.env.UPLOADS, decodedKey);
  if (object) {
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new Response(object.body, { headers });
  }

  const localFile = readLegacyLocalFile(decodedKey);
  if (localFile) {
    return new Response(localFile.body, {
      headers: {
        "content-type": localFile.contentType,
        "cache-control": "public, max-age=86400",
      },
    });
  }

  const remoteFile = await fetchLegacyRemoteFile(decodedKey);
  if (remoteFile) {
    const headers = new Headers();
    headers.set("content-type", remoteFile.contentType);
    headers.set("cache-control", "public, max-age=86400");
    return new Response(remoteFile.body, { headers });
  }

  return new Response("Not found", { status: 404 });
}
