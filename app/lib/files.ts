export function getPublicUploadUrl(key: string) {
  return `/api/files/${key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}
