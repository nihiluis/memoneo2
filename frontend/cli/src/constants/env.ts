export const DEV = process.env.NODE_ENV !== "production"

export const IS_SERVER = typeof window === "undefined"

export const BASE_PATH = DEV ? "/" : "/web"

export const PRODUCT_NAME = "Memoneo"
export const SITE_TITLE = PRODUCT_NAME

export const AUTH_API_URL = DEV ? "http://localhost:8089" : "https://auth.memoneo2.nihiluis.com"
export const MASTER_API_URL = DEV ? "http://localhost:8094" : "https://master.memoneo2.nihiluis.com"

export const ENDPOINT_AUTH_URL = `${AUTH_API_URL}/auth`
export const ENDPOINT_LOGIN_URL = `${AUTH_API_URL}/login`
export const ENDPOINT_REGISTER_URL = `${AUTH_API_URL}/register`
export const ENDPOINT_LOGOUT_URL = `${AUTH_API_URL}/logout`
export const ENDPOINT_SAVE_KEY_URL = `${AUTH_API_URL}/enckey/save`

export const ENDPOINT_GQL_URL = `${MASTER_API_URL}/v1/graphql`
export const ENDPOINT_RELAY_URL = `${MASTER_API_URL}/v1/relay`
