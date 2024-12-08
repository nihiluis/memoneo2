import { createRequire } from "module"
const require = createRequire(import.meta.url)

const config = require("../config.json")

export const DEV = process.env.NODE_ENV === "development"

export const BASE_PATH = DEV ? config.basePath.dev : config.basePath.prod

export const AUTH_API_URL = DEV ? config.authApiUrl.dev : config.authApiUrl.prod
export const MASTER_API_URL = DEV
  ? config.masterApiUrl.dev
  : config.masterApiUrl.prod

export const ENDPOINT_AUTH_URL = `${AUTH_API_URL}/auth`
export const ENDPOINT_GQL_URL = `${MASTER_API_URL}/v1/graphql`
export const ENDPOINT_RELAY_URL = `${MASTER_API_URL}/v1/relay`

export const PORT = process.env.PORT || 8073

export const VERSION = "0.0.1"
