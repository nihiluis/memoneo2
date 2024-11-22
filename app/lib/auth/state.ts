import { atom } from "jotai"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define the authentication state interface
interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    mail: string
    // Add other user properties as needed
  }
}

// Initial auth state
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: {
    id: "",
    mail: "",
  },
}

export const TOKEN_STORAGE_KEY = "auth_token"

// Create the auth atom
export const authAtom = atom<AuthState>(initialAuthState)
const innerTokenAtom = atom<string>("")
export const tokenAtom = atom(
  async get => get(innerTokenAtom),
  async (_get, set, newToken: string) => {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, newToken)

    set(tokenAtom, newToken)
  }
)

// Optional: Create derived atoms for specific auth state properties
export const isAuthenticatedAtom = atom(get => get(authAtom).isAuthenticated)
export const userAtom = atom(get => get(authAtom).user)
