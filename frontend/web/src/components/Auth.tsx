import React, {
  useState,
  useEffect,
  PropsWithChildren,
  useContext,
} from "react"
import { useRouter } from "next/router"
import Head from "next/head"

import { checkAuth, setSessionToken } from "../lib/auth"
import Loading from "./Loading"
import { setLocalWorkspaceId } from "../lib/workspace"
import { LOGIN_URL } from "../constants/env"

interface AuthContextValues {
  auth: AuthState
  setAuth: (state: AuthState) => void
}

export const AuthContext = React.createContext<AuthContextValues>(undefined)

export interface AuthState {
  authenticated: boolean
  error: string
  token: string
  userId: string
}

interface Props {
  require: boolean
  initialToken?: string
}

export default function Auth(props: PropsWithChildren<Props>) {
  const { require, initialToken } = props

  const { auth, setAuth } = useContext(AuthContext)

  const [authLoading, setAuthLoading] = useState<boolean>(false)
  const [initialized, setInitialized] = useState<boolean>(false)

  useEffect(() => {
    console.log("doing initial auth with token " + initialToken)

    let isCancelled = false

    const fetchData = async () => {
      if (!auth.authenticated) {
        setAuthLoading(true)

        const { success, token, userId, error } = await checkAuth(initialToken)

        if (!isCancelled) {
          setAuthLoading(false)
          setSessionToken(token)
          setAuth({ authenticated: success, token, userId, error })
        }
      } else if (authLoading) {
        setAuthLoading(false)
      }
    }

    fetchData()

    setInitialized(true)

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (require && !auth.authenticated && !authLoading && initialized) {
      setLocalWorkspaceId("")

      window.location.href = LOGIN_URL
    }
  }, [auth])

  return (
    <React.Fragment>
      <Head>{authLoading && <title>Authenticating...</title>}</Head>
      {require && auth.authenticated && !authLoading && props.children}
      {authLoading && <Loading />}
      {!require && !authLoading && props.children}
    </React.Fragment>
  )
}
