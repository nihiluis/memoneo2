import { ENDPOINT_RELAY_URL } from "../constants/env"
import { getSessionToken } from "../lib/auth"

async function fetchGraphQL(text: any, variables: any) {
  const token = getSessionToken()

  const response = await fetch(ENDPOINT_RELAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  })

  return await response.json()
}

export default fetchGraphQL
