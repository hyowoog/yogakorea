/** 그누보드 MySQL PASSWORD() 해시 검증 (* + SHA1(SHA1(password))) */

export async function mysqlPasswordHash(password: string) {
  const data = new TextEncoder().encode(password);
  const hash1 = await crypto.subtle.digest("SHA-1", data);
  const hash2 = await crypto.subtle.digest("SHA-1", hash1);
  const hex = Array.from(new Uint8Array(hash2))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return `*${hex}`;
}

export async function verifyLegacyPassword(password: string, hash: string) {
  if (!hash) return false;

  if (hash.startsWith("*")) {
    return (await mysqlPasswordHash(password)) === hash;
  }

  return false;
}
