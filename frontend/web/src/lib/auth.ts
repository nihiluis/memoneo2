import axios from "axios"
import {
  ENDPOINT_AUTH_URL,
  ENDPOINT_LOGIN_URL,
  ENDPOINT_LOGOUT_URL,
  ENDPOINT_REGISTER_URL,
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
  const enckey: Enckey = res.data.enckey

  console.log("auth success")
  return { success: true, token, enckey, userId, error: "" }
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
    return {
      success: false,
      token: "",
      userId: "",
      enckey: undefined,
      error: error.message,
    }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId
  const enckey: Enckey = res.data.enckey

  return { success: true, token, userId, enckey, error: "" }
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

export async function logout() {
  setSessionToken("")

  await protect(
    axios.get(ENDPOINT_LOGOUT_URL, {
      withCredentials: true,
    })
  )
}

export function getSessionToken(): string {
  return sessionStorage.getItem(SESSION_TOKEN_KEY)
}

export function setSessionToken(token: string) {
  sessionStorage.setItem(SESSION_TOKEN_KEY, token)
}
