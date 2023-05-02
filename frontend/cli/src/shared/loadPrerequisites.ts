import { Client } from "@urql/core"
import protect from "await-protect"
import { AuthResult } from "../lib/auth"
import { createGqlClient } from "../lib/gql"
import {
  loadConfig,
  loadInternalConfig,
  MemoneoConfig,
  MemoneoInternalConfig,
} from "./config"
import { MemoneoFileCache, reloadOrCreateFileCache } from "./fileCache"
import { loadKey } from "./loadKey"
import { validateAuth } from "./validateAuth"
import * as dotenv from "dotenv"

interface Prerequisites {
  internalConfig: MemoneoInternalConfig
  config: MemoneoConfig
  auth: AuthResult
  cache: MemoneoFileCache
  key: CryptoKey
  gqlClient: Client
}

export default async function loadPrerequisites(): Promise<Prerequisites> {
  dotenv.config()
  
  const internalConfig = await loadInternalConfig()
  if (!internalConfig) {
    throw new Error("Initialize first via the init command")
  }
  const [config, configErr] = await protect(loadConfig())
  if (configErr || !config) {
    throw configErr ?? new Error("Config null")
  }

  const cache = await reloadOrCreateFileCache()

  const key = await loadKey()

  const [auth, authValidationError] = await protect(
    validateAuth(internalConfig)
  )
  if (authValidationError || !auth) {
    throw authValidationError ?? new Error("Unable to retrieve auth")
  }

  const gqlClient = createGqlClient(auth.token, internalConfig!)

  return { cache, key, auth, config, gqlClient, internalConfig }
}
