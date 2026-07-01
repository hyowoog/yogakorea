export function getPublicUploadUrl(key: string) {
  return `/api/files/${encodeURIComponent(key)}`;
}
