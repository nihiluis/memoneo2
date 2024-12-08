import { atom } from "jotai"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Enckey } from "./api"

interface AuthState {
  isLoading: boolean
  isAuthenticated: boolean
  error: string
  user: {
    id: string
    mail: string
  }
  enckey: Enckey | null
}

const initialAuthState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  error: "",
  user: {
    id: "",
    mail: "",
  },
  enckey: null,
}

export const TOKEN_STORAGE_KEY = "auth_token"

// Create the auth atom
export const authAtom = atom<AuthState>(initialAuthState)
const innerTokenAtom = atom<string>("")
export const tokenAtom = atom(
  async get => get(innerTokenAtom),
  async (_get, set, newToken: string) => {
    console.log("Setting token")
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, newToken)

    set(innerTokenAtom, newToken)
  }
)

// Optional: Create derived atoms for specific auth state properties
export const isAuthenticatedAtom = atom(get => get(authAtom).isAuthenticated)
export const userAtom = atom(get => get(authAtom).user)
