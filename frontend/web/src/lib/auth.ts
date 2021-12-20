import axios from "axios"
import {
  ENDPOINT_AUTH_URL,
  ENDPOINT_LOGIN_URL,
  ENDPOINT_REGISTER_URL,
  ENDPOINT_SAVE_KEY_URL,
} from "../constants/env"
import protect from "await-protect"

export type Enckey = {
  key: string
  salt: string
}

interface AuthResult {
  success: boolean
  error: string
  enckey?: Enckey
  token: string
  userId: string
}

export async function checkAuth(
  existingToken: string = ""
): Promise<AuthResult> {
  const headers: any = {}
  if (existingToken) {
    //this seems to break Chrome, but not firefox.
    //headers["Authorization"] = `Bearer ${existingToken}`
  }

  console.log("checking auth")

  const [res, error] = await protect(
    axios.get(ENDPOINT_AUTH_URL, { headers, withCredentials: true })
  )

  if (error || !res.data.hasOwnProperty("token")) {
    return {
      success: false,
      token: "",
      enckey: null,
      userId: "",
      error: error.message,
    }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId
  const keypair: Enckey = res.data.keypair

  return { success: true, token, enckey: keypair, userId, error: "" }
}

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

  return { ivStr, ctStr }
}

async function decryptProtectedKey(
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

async function encryptText(
  text: string,
  protectedKey: CryptoKey
): Promise<EncryptTextResult> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ivStr = Array.from(iv)
    .map(b => String.fromCharCode(b))
    .join("")

  const alg = { name: "AES-GCM", iv: iv }

  const ctBuffer = await window.crypto.subtle.encrypt(
    alg,
    protectedKey,
    new TextEncoder().encode(text)
  )

  const ctArray = Array.from(new Uint8Array(ctBuffer))
  const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join("")

  return { ivStr, ctStr }
}

async function decryptText(
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

export async function createNewKey(password: string = "testestetstst") {
  const encryptionTestMessage =
    "swaggyswagswag Hallo Leute, ich bin's, jop der echte, der Jensi! Merry Christmas"

  const generatedProtectedKey = await generateProtectedKey()
  const { ivStr: textIvStr, ctStr: textCtStr } = await encryptText(
    encryptionTestMessage,
    generatedProtectedKey
  )

  const { ivStr, ctStr } = await encryptProtectedKey(
    password,
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
  console.log("Decrypted plaintext " + plaintext)

  /*
  const [res, error] = await protect(
    axios.post(
      ENDPOINT_SAVE_KEY_URL,
      { key: window.btoa(ctStr), salt: window.btoa(ivStr) },
      {
        withCredentials: true,
      }
    )
  )

  if (error || !res.data.hasOwnProperty("token")) {
    return { success: false, token: "", userId: "", error: error.message }
  }
  */
}

export async function login(
  mail: string,
  password: string
): Promise<AuthResult> {
  const [res, error] = await protect(
    axios.post(
      ENDPOINT_LOGIN_URL,
      { mail, password },
      {
        withCredentials: true,
      }
    )
  )

  if (error || !res.data.hasOwnProperty("token")) {
    return { success: false, token: "", userId: "", error: error.message }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId

  return { success: true, token, userId, error: "" }
}

export async function register(
  mail: string,
  password: string
): Promise<AuthResult> {
  const [res, error] = await protect(
    axios.post(
      ENDPOINT_REGISTER_URL,
      {
        user: { firstName: "Placeholder", lastName: "Placeholder", mail },
        password,
      },
      {
        withCredentials: true,
      }
    )
  )

  if (error || !res.data.hasOwnProperty("token")) {
    return {
      success: false,
      token: "",
      userId: "",
      error: error?.message ?? "Token not provided.",
    }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId

  return { success: true, token, userId, error: "" }
}

const SESSION_TOKEN_KEY = "token"

export function getSessionToken(): string {
  return sessionStorage.getItem(SESSION_TOKEN_KEY)
}

export function setSessionToken(token: string) {
  sessionStorage.setItem(SESSION_TOKEN_KEY, token)
}
