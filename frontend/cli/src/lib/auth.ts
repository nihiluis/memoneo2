import axios from "axios"
import { ENDPOINT_AUTH_URL, ENDPOINT_LOGIN_URL } from "../constants/env"
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

export async function tryReadToken(): Promise<string> {
  return ""
}

export async function checkAuth(
  existingToken: string = ""
): Promise<AuthResult> {
  const headers: any = {}
  if (existingToken) {
    //this seems to break Chrome, but not firefox.
    //headers["Authorization"] = `Bearer ${existingToken}`
  }

  const [res, error] = await protect<any, Error>(
    axios.get(ENDPOINT_AUTH_URL, { headers, withCredentials: true })
  )

  if (error || !res.data.hasOwnProperty("token")) {
    return {
      success: false,
      token: "",
      enckey: undefined,
      userId: "",
      error: error?.message ?? "",
    }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId
  const enckey: Enckey = res.data.enckey

  return { success: true, token, enckey, userId, error: "" }
}

export async function login(
  mail: string,
  password: string
): Promise<AuthResult> {
  const [res, error] = await protect<any, Error>(
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
      error: error?.message ?? "",
    }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId
  const enckey: Enckey = res.data.enckey

  return { success: true, token, userId, enckey, error: "" }
}
