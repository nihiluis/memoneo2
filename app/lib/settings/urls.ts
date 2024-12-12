import {
  AUTH_BASE_URL,
  GQL_WRAPPER_BASE_URL,
  MASTER_BASE_URL,
} from "@/constants/env"

export function getAuthUrl(path: string) {
  return `${AUTH_BASE_URL}${path}`
}

export function getMasterUrl(path: string) {
  return `${MASTER_BASE_URL}${path}`
}

export function getGqlWrapperUrl(path: string) {
  return `${GQL_WRAPPER_BASE_URL}${path}`
}
