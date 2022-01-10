export function decodeBase64String(str: string): string {
  return Buffer.from(str, "base64").toString("utf-8")
}

export function encodeBase64String(str: string): string {
  return Buffer.from(str).toString("base64")
}
