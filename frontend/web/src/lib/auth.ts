import axios from "axios"
import {
  ENDPOINT_AUTH_URL,
  ENDPOINT_LOGIN_URL,
  ENDPOINT_REGISTER_URL,
} from "../constants/env"
import protect from "await-protect"

interface Keypair {
  pubKey: string
  privateKey: string
}

interface AuthResult {
  success: boolean
  error: string
  keypair?: Keypair
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
      keypair: null,
      userId: "",
      error: error.message,
    }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId
  const keypair: Keypair = res.data.keypair

  return { success: true, token, keypair, userId, error: "" }
}

export async function createNewKeypair() {
  // scrap this. no asynchronous needed. will use aes 256 to encrypt and decrypt.
  const key = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-384",
    },
    true,
    ["deriveKey", "deriveBits"]
  )
  const exportedPrivateKey = await window.crypto.subtle.exportKey(
    "jwk",
    key.privateKey
  )
  const exportedPublicKey = await window.crypto.subtle.exportKey(
    "jwk",
    key.publicKey
  )

  const privateKeyText = JSON.stringify(exportedPrivateKey)
  const publicKeyText = JSON.stringify(exportedPublicKey)

  const signature = await window.crypto.subtle.sign(
    {
      name: "ECDH",
      hash: {
        name: "P-384",
      },
    },
    key.publicKey,
    new TextEncoder().encode("swagcityclique")
  )

  si
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
