import axios, { AxiosHeaders } from "axios"
import { ENDPOINT_AUTH_URL, ENDPOINT_LOGIN_URL } from "../constants/env"
import protect from "await-protect"
import * as fs from "fs/promises"

export type Enckey = {
  key: string
  salt: string
}

export interface AuthResult {
  success: boolean
  errorMessage: string
  error?: Error
  enckey?: Enckey
  token: string
  userId: string
}

function getDefaultHeaders() {
  return {
    "Proxy-Authorization": process.env.PROXY_AUTHORIZATION_HEADER ?? "",
  }
}

export async function checkAuth(
  existingToken: string = ""
): Promise<AuthResult> {
  const headers: any = getDefaultHeaders()
  if (existingToken) {
    headers["Authorization"] = `Bearer ${existingToken}`
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
      errorMessage: error?.message ?? "",
      error,
    }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId
  const enckey: Enckey = res.data.enckey

  return { success: true, token, enckey, userId, errorMessage: "" }
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
        headers: getDefaultHeaders(),
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
      errorMessage: error?.message ?? "",
      error,
    }
  }

  const token: string = res.data.token
  const userId: string = res.data.userId
  const enckey: Enckey = res.data.enckey

  return { success: true, token, userId, enckey, errorMessage: "" }
}
