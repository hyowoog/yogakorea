function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function buildR2Key(folder: string, fileName: string) {
  const date = new Date();
  const prefix = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`;
  const unique = crypto.randomUUID();
  return `${folder}/${prefix}/${unique}-${sanitizeFileName(fileName)}`;
}

export async function uploadToR2(
  bucket: Env["UPLOADS"],
  file: File,
  folder = "uploads",
) {
  const key = buildR2Key(folder, file.name);
  const buffer = await file.arrayBuffer();

  await bucket.put(key, buffer, {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
    },
  });

  return {
    key,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || "application/octet-stream",
  };
}

export async function getR2Object(bucket: Env["UPLOADS"], key: string) {
  return bucket.get(key);
}
