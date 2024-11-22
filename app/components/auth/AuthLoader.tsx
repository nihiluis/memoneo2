import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAtom } from "jotai"
import { authAtom, TOKEN_STORAGE_KEY, tokenAtom } from "@/lib/auth/state"
import { useEffect, useState } from "react"
import { apiCheckAuth } from "@/lib/auth/api"
import { useRouter } from "expo-router"
import { ActivityIndicator } from "react-native"

export default function AuthLoader({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [auth, setAuth] = useAtom(authAtom)
  const [token, setToken] = useAtom(tokenAtom)
  const [authInitialized, setAuthInitialized] = useState(false)

  const { isAuthenticated } = auth

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY)
      setToken(storedToken ?? "")
    }
    loadToken()
  }, [])

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        const { success, userId, mail } = await apiCheckAuth(token)
        setAuth({ isAuthenticated: success, user: { id: userId, mail } })
      }
      setAuthInitialized(true)
    }
    checkAuth()
  }, [token])

  useEffect(() => {
    if (authInitialized && !isAuthenticated) {
      router.replace("/auth/login")
    }
  }, [authInitialized, isAuthenticated])

  if (!authInitialized) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  return children
}
