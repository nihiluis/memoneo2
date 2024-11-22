import protect from "await-protect"
import axios from "axios"
import { getAuthUrl } from "../settings/urls"
import { AUTH_PATH, LOGIN_PATH } from "@/constants/env"

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
    mail: string
  }

function getDefaultHeaders(token?: string) {
  const headers = {
    Authorization: "",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

export async function apiCheckAuth(
    existingToken: string = ""
  ): Promise<AuthResult> {
    const headers = getDefaultHeaders(existingToken)
  
    const [res, error] = await protect<any, Error>(
      axios.get(getAuthUrl(AUTH_PATH), { headers, withCredentials: true })
    )
  
    if (error || !res.data.hasOwnProperty("token")) {
      return {
        success: false,
        token: "",
        enckey: undefined,
        userId: "",
        errorMessage: error?.message ?? "",
        error,
        mail: "",
      }
    }
  
    const token: string = res.data.token
    const userId: string = res.data.userId
    const enckey: Enckey = res.data.enckey
    const mail: string = res.data.mail
  
    return { success: true, token, mail, enckey, userId, errorMessage: "" }
  }

  export async function apiLogin(
    mail: string,
    password: string
  ): Promise<AuthResult> {
    const [res, error] = await protect<any, Error>(
      axios.post(
        getAuthUrl(LOGIN_PATH),
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
        mail,
      }
    }
  
    const token: string = res.data.token
    const userId: string = res.data.userId
    const enckey: Enckey = res.data.enckey
  
    return { success: true, token, userId, enckey, mail, errorMessage: "" }
  }