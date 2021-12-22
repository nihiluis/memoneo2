import create, { PartialState, SetState } from "zustand"
import { combine } from "zustand/middleware"

interface KeyStore {
  key?: CryptoKey
  protectedKey?: string
  salt?: string
  password: string
  error: string
}

export const useKeyStore = create(
  combine(
    {
      key: undefined as CryptoKey | undefined,
      protectedKey: undefined as string | undefined,
      salt: "",
      password: "",
      error: "",
    },
    (set, get) => ({
      set,
    })
  )
)
