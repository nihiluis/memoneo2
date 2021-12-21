import React, {
  useState,
  useEffect,
  PropsWithChildren,
  useContext,
  useRef,
} from "react"
import { useRouter } from "next/router"
import Head from "next/head"

import {
  checkAuth,
  createNewKey,
  decryptProtectedKey,
  setSessionToken,
} from "../lib/auth"
import Loading from "./Loading"
import { useKeyStore } from "../stores/key"

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

  const router = useRouter()

  const { auth, setAuth } = useContext(AuthContext)

  const [authLoading, setAuthLoading] = useState<boolean>(false)
  const [initialized, setInitialized] = useState<boolean>(false)

  const password = useKeyStore(state => state.password)
  const protectedKey = useKeyStore(state => state.protectedKey)
  const salt = useKeyStore(state => state.salt)

  const setKeyData = useKeyStore(state => state.set)

  const cancelled = useRef(false)

  useEffect(() => {
    console.log("doing initial auth with token " + initialToken)

    const fetchData = async () => {
      if (!auth.authenticated) {
        setAuthLoading(true)

        const { success, token, enckey, userId, error } = await checkAuth(
          initialToken
        )

        if (enckey) {
          setKeyData({
            protectedKey: enckey.key,
            salt: window.atob(enckey.salt),
          })
        }
        if (!cancelled.current) {
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
      cancelled.current = true
    }
  }, [])

  useEffect(() => {
    const loadKey = async () => {
      if (password) {
        if (!protectedKey) {
          // generate key to use for encryption
          console.log("creating new key")
          const { key, salt, error } = await createNewKey(password)

          if (error) {
            console.error("unable to generate encryption key.")
            setKeyData({ error: "no key available", password: "" })
            return
          }

          setKeyData({ key, salt, password: "" })
        } else {
          // decrypt key to use for encryption
          console.log("decrypting existing key")

          const key = await decryptProtectedKey(password, protectedKey, salt)
          setKeyData({ key, salt, password: "" })
        }
      } else {
        // persisting the key and salt is not currently supported
        console.log("no key available")
        setKeyData({ error: "no key available", password: "" })
      }
    }

    loadKey()
  }, [password, salt, protectedKey])

  useEffect(() => {
    if (require && !auth.authenticated && !authLoading && initialized) {
      router.push("/login")
    }

    if (
      auth.authenticated &&
      (router.pathname === "/login" || router.pathname === "/register")
    ) {
      router.push("/")
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
