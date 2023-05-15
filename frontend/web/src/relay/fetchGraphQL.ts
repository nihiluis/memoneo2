import { ENDPOINT_RELAY_URL } from "../constants/env"
import { getSessionToken } from "../lib/auth"

async function fetchGraphQL(text: any, variables: any) {
  const token = getSessionToken()

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }

  if (process.env.NEXT_PUBLIC_PROXY_AUTHORIZATION_HEADER) {
    headers["Authelia-Authorization"] =
      process.env.NEXT_PUBLIC_PROXY_AUTHORIZATION_HEADER
  }

  const response = await fetch(ENDPOINT_RELAY_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: text,
      variables,
    }),
  })

  return await response.json()
}

export default fetchGraphQL
