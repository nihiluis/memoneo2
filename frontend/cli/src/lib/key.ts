import protect from "await-protect"
import axios from "axios"
import { crypto } from "./reexports"
import { ENDPOINT_SAVE_KEY_URL } from "../constants/env"

export async function getBufferForKey(key: CryptoKey): Promise<Buffer> {
  return Buffer.from(await crypto.subtle.exportKey("raw", key))
}

export async function decryptProtectedKey(
  password: string,
  ctStr: string,
  ivStr: string
): Promise<CryptoKey> {
  const decryptPwUtf8 = new TextEncoder().encode(password)
  const decryptPwHash = await crypto.subtle.digest("SHA-256", decryptPwUtf8)

  const decryptIv = new Uint8Array(
    Array.from(ivStr).map(ch => ch.charCodeAt(0))
  )
  const decryptAlg = { name: "AES-GCM", iv: decryptIv }

  const decryptPwKey = await crypto.subtle.importKey(
    "raw",
    decryptPwHash,
    decryptAlg,
    false,
    ["encrypt", "decrypt"]
  )

  const ctUint8 = new Uint8Array(Array.from(ctStr).map(ch => ch.charCodeAt(0)))

  const protectedKeyBuffer = await crypto.subtle.decrypt(
    decryptAlg,
    decryptPwKey,
    ctUint8
  )

  return await crypto.subtle.importKey(
    "raw",
    protectedKeyBuffer,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  )
}

interface EncryptTextResult {
  ctStr: string
  ivStr: string
}

export async function encryptText(
  text: string,
  saltStr: string,
  protectedKey: CryptoKey
): Promise<EncryptTextResult> {
  const iv = new Uint8Array(Array.from(saltStr).map(ch => ch.charCodeAt(0)))
  const alg = { name: "AES-GCM", iv: iv }

  const ctBuffer = await window.crypto.subtle.encrypt(
    alg,
    protectedKey,
    new TextEncoder().encode(text)
  )

  const ctArray = Array.from(new Uint8Array(ctBuffer))
  const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join("")

  return { ivStr: saltStr, ctStr }
}

export async function decryptText(
  ctStr: string,
  ivStr: string,
  protectedKey: CryptoKey
): Promise<string> {
  const decryptIv = new Uint8Array(
    Array.from(ivStr).map(ch => ch.charCodeAt(0))
  )
  const decryptAlg = { name: "AES-GCM", iv: decryptIv }

  const ctUint8 = new Uint8Array(Array.from(ctStr).map(ch => ch.charCodeAt(0)))

  const protectedKeyBuffer = await crypto.subtle.decrypt(
    decryptAlg,
    protectedKey,
    ctUint8
  )

  const plaintext = new TextDecoder().decode(protectedKeyBuffer)

  return plaintext
}
