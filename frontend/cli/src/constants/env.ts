import config from "../../config.json"

export const DEV = process.env.NODE_ENV !== "production"

export const IS_SERVER = typeof window === "undefined"

export const BASE_PATH = DEV ? config.basePath.dev : config.basePath.prod

export const PRODUCT_NAME = config.productName
export const SITE_TITLE = PRODUCT_NAME

export const AUTH_API_URL = DEV ? config.authApiUrl.dev : config.authApiUrl.prod
export const MASTER_API_URL = DEV
  ? config.masterApiUrl.dev
  : config.masterApiUrl.prod

export const ENDPOINT_AUTH_URL = `${AUTH_API_URL}/auth`
export const ENDPOINT_LOGIN_URL = `${AUTH_API_URL}/login`
export const ENDPOINT_REGISTER_URL = `${AUTH_API_URL}/register`
export const ENDPOINT_LOGOUT_URL = `${AUTH_API_URL}/logout`
export const ENDPOINT_SAVE_KEY_URL = `${AUTH_API_URL}/enckey/save`

export const ENDPOINT_GQL_URL = `${MASTER_API_URL}/v1/graphql`
export const ENDPOINT_RELAY_URL = `${MASTER_API_URL}/v1/relay`

export const VERSION = "0.0.1"
