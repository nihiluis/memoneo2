import axios from "axios"
import { ENDPOINT_AUTH_URL, ENDPOINT_LOGIN_URL } from "../constants/env"
import protect from "await-protect"

interface AuthResult {
  success: boolean
  error: string
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
    return { success: false, token: "", userId: "", error: error.message }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId

  return { success: true, token, userId, error: "" }
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

const SESSION_TOKEN_KEY = "token"

export function getSessionToken(): string {
  return sessionStorage.getItem(SESSION_TOKEN_KEY)
}

export function setSessionToken(token: string) {
  sessionStorage.setItem(SESSION_TOKEN_KEY, token)
}
