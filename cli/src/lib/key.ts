import { crypto } from "./reexports.js"

export async function getBufferForKey(key: CryptoKey): Promise<Buffer> {
  return Buffer.from(await crypto.subtle.exportKey("raw", key))
}

export async function generateProtectedKey(): Promise<CryptoKey> {
  const protectedKey = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  )

  return protectedKey
}

interface EncryptProtectedKeyResult {
  iv: Uint8Array
  ivStr: string
  ctStr: string
}

export async function encryptProtectedKey(
  password: string,
  protectedKey: CryptoKey
): Promise<EncryptProtectedKeyResult> {
  const pwUtf8 = new TextEncoder().encode(password)
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8)

  const exportedKey = await crypto.subtle.exportKey("raw", protectedKey)

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ivStr = Array.from(iv)
    .map(b => String.fromCharCode(b))
    .join("")

  const alg = { name: "AES-GCM", iv: iv }

  const encryptionKey = await crypto.subtle.importKey(
    "raw",
    pwHash,
    alg,
    false,
    ["encrypt", "decrypt"]
  )

  const ctBuffer = await crypto.subtle.encrypt(alg, encryptionKey, exportedKey)

  const ctArray = Array.from(new Uint8Array(ctBuffer))
  const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join("")

  return { iv, ivStr, ctStr }
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
  protectedKey: CryptoKey
): Promise<EncryptTextResult> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ivStr = Array.from(iv)
    .map(b => String.fromCharCode(b))
    .join("")
  const alg = { name: "AES-GCM", iv: iv }

  const ctBuffer = await crypto.subtle.encrypt(
    alg,
    protectedKey,
    new TextEncoder().encode(text)
  )

  const ctArray = Array.from(new Uint8Array(ctBuffer))
  const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join("")

  return { ivStr, ctStr }
}

export async function decryptText(
  ctStr: string,
  ivStr: string,
  protectedKey: CryptoKey
): Promise<string> {
  if (!ctStr || !ivStr) {
    throw new Error("Missing required parameters: ciphertext or IV is empty")
  }

  const decryptIv = new Uint8Array(
    Array.from(ivStr).map(ch => ch.charCodeAt(0))
  )
  const decryptAlg = { name: "AES-GCM", iv: decryptIv }

  const ctUint8 = new Uint8Array(Array.from(ctStr).map(ch => ch.charCodeAt(0)))

  try {
    const protectedKeyBuffer = await crypto.subtle.decrypt(
      decryptAlg,
      protectedKey,
      ctUint8
    )

    const plaintext = new TextDecoder().decode(protectedKeyBuffer)

    return plaintext
  } catch (err: unknown) {
    const error = err as Error
    console.error("Failed to decrypt text. Details:", {
      error,
      ivLength: ivStr.length,
      ctLength: ctStr.length,
      keyAlgorithm: protectedKey.algorithm,
      keyUsages: protectedKey.usages,
      errorName: error.name,
      errorMessage: error.message,
      errorCause: (error.cause as Error)?.message
    })
    throw new Error(
      "Failed to decrypt text. This could be due to:\n" +
      "1. Invalid encryption key (most likely cause)\n" +
      "2. Corrupted ciphertext\n" +
      "3. Mismatched IV (initialization vector)\n" +
      "Please ensure you're using the correct encryption key and the data hasn't been corrupted.\n" +
      `Technical details: ${error.name}: ${error.message}`
    )
  }
}
