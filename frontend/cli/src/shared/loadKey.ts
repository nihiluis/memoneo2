import protect from "await-protect"
import * as fs from "fs/promises"
import { crypto } from "../lib/reexports"
import { decodeBase64String } from "./base64"

export interface MemoneoFileConfig {
  mail: string
  userId: string
}

export async function loadKey(): Promise<CryptoKey> {
  const keyString = await fs.readFile("./.memoneo/key", { encoding: "utf-8" })

  const encodedKeyString = atob(keyString!)
  const encodedKeyArray = new Uint8Array(
    Array.from(encodedKeyString).map(ch => ch.charCodeAt(0))
  )
  const key = await crypto.subtle.importKey(
    "raw",
    encodedKeyArray,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  )

  return key
}
