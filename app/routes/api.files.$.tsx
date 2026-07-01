import type { Route } from "./+types/api.files.$";
import { getR2Object } from "~/lib/r2.server";

export async function loader({ params, context }: Route.LoaderArgs) {
  const key = params["*"];
  if (!key) {
    return new Response("Not found", { status: 404 });
  }

  const object = await getR2Object(context.cloudflare.env.UPLOADS, decodeURIComponent(key));
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
}
