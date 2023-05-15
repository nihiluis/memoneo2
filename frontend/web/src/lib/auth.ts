import axios, { AxiosError, AxiosResponse } from "axios"
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

function getHeaders() {
  const headers: any = {}

  if (process.env.NEXT_PUBLIC_PROXY_AUTHORIZATION_HEADER) {
    headers["Authelia-Authorization"] =
      process.env.NEXT_PUBLIC_PROXY_AUTHORIZATION_HEADER
  }

  return headers
}

export async function checkAuth(
  existingToken: string = ""
): Promise<AuthResult> {
  const headers = getHeaders()

  if (existingToken) {
    //this seems to break Chrome, but not firefox.
    //headers["Authorization"] = `Bearer ${existingToken}`
  }

  // console.log("checking auth")

  const [res, error] = await protect<AxiosResponse, AxiosError>(
    axios.get(ENDPOINT_AUTH_URL, { headers, withCredentials: true })
  )

  // const [res, error] = await protect(
  //   axios.get(ENDPOINT_AUTH_URL, { headers, withCredentials: true })
  // )

  if (error || !res.data.hasOwnProperty("token")) {
    return {
      success: false,
      token: "",
      enckey: null,
      userId: "",
      error: error?.response?.data.message ?? error?.message ?? "token not found",
    }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId
  const enckey: Enckey = res.data.enckey

  // console.log("auth success")
  return { success: true, token, enckey, userId, error: "" }
}

export async function login(
  mail: string,
  password: string
): Promise<AuthResult> {
  const headers = getHeaders()

  const [res, error] = await protect(
    axios.post(
      ENDPOINT_LOGIN_URL,
      { mail, password },
      {
        headers,
        withCredentials: true,
      }
    )
  )

  const body = res?.data

  if (error || !body.hasOwnProperty("token")) {
    return {
      success: false,
      token: "",
      userId: "",
      enckey: undefined,
      error: body?.message ?? error?.message ?? "Token not found.",
    }
  }

  const token: string = body.token
  const userId: string = body.userId
  const enckey: Enckey = body.enckey

  return { success: true, token, userId, enckey, error: "" }
}

export async function register(
  mail: string,
  password: string
): Promise<AuthResult> {
  const headers = getHeaders()

  const [res, error] = await protect(
    axios.post(
      ENDPOINT_REGISTER_URL,
      {
        user: { firstName: "Placeholder", lastName: "Placeholder", mail },
        password,
      },
      {
        headers,
        withCredentials: true,
      }
    )
  )

  if (error || !res.data.hasOwnProperty("token")) {
    return {
      success: false,
      token: "",
      userId: "",
      error: res?.data.message ?? error?.message ?? "Token not found.",
    }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId

  return { success: true, token, userId, error: "" }
}

const SESSION_TOKEN_KEY = "token"

export async function logout() {
  setSessionToken("")

  const headers = getHeaders()

  await protect(
    axios.get(ENDPOINT_LOGOUT_URL, {
      headers,
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
