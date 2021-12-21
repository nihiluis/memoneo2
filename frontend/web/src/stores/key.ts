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
  combine<KeyStore, any>(
    {
      key: undefined,
      protectedKey: undefined,
      salt: undefined,
      password: "",
      error: "",
    },
    (set, get) => ({
      set,
    })
  )
)
