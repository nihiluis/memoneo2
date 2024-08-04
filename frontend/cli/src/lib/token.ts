import * as fs from "fs/promises"

export async function readToken(): Promise<string> {
  const tokenBuffer = await fs.readFile("./.memoneo/token")

  return tokenBuffer.toString("utf-8")
}

export async function writeToken(token: string) {
  const encodedToken = Buffer.from(token, "utf8")

  await fs.writeFile("./.memoneo/token", encodedToken, { encoding: "base64" })
}
