import protect from "await-protect"
import axios from "axios"
import { ENDPOINT_SAVE_KEY_URL } from "../constants/env"

async function generateProtectedKey(): Promise<CryptoKey> {
  const protectedKey = await window.crypto.subtle.generateKey(
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

async function encryptProtectedKey(
  password: string,
  protectedKey: CryptoKey
): Promise<EncryptProtectedKeyResult> {
  const pwUtf8 = new TextEncoder().encode(password)
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8)

  const exportedKey = await window.crypto.subtle.exportKey("raw", protectedKey)

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

  const ctBuffer = await window.crypto.subtle.encrypt(
    alg,
    encryptionKey,
    exportedKey
  )

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

  try {
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
  } catch (ex: any) {
    console.log(ex)
  }
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

export async function testEncryption(password: string = "swaggyswagswag") {
  const encryptionTestMessage =
    "swaggyswagswag Hallo Leute, ich bin's, jop der echte, der Jensi! Merry Christmas"

  const generatedProtectedKey = await generateProtectedKey()

  const { ivStr, ctStr } = await encryptProtectedKey(
    password,
    generatedProtectedKey
  )

  const { ivStr: textIvStr, ctStr: textCtStr } = await encryptText(
    encryptionTestMessage,
    ivStr,
    generatedProtectedKey
  )

  const decryptedProtectedKey = await decryptProtectedKey(
    password,
    ctStr,
    ivStr
  )

  const plaintext = await decryptText(
    textCtStr,
    textIvStr,
    decryptedProtectedKey
  )
  // console.log("Decrypted plaintext " + plaintext)
}

interface CreateNewKeyResult {
  key?: CryptoKey
  salt?: string
  error: string
}

export async function createNewKey(
  password: string
): Promise<CreateNewKeyResult> {
  const generatedProtectedKey = await generateProtectedKey()

  const { iv, ivStr, ctStr } = await encryptProtectedKey(
    password,
    generatedProtectedKey
  )

  const [_, error] = await protect(
    axios.post(
      ENDPOINT_SAVE_KEY_URL,
      { key: window.btoa(ctStr), salt: window.btoa(ivStr) },
      {
        withCredentials: true,
      }
    )
  )

  if (error) {
    return { error: error.message }
  }

  return {
    key: generatedProtectedKey,
    salt: ivStr,
    error: "",
  }
}
