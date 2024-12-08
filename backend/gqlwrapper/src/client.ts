import { createClient, Client, cacheExchange, fetchExchange } from "@urql/core"
import { ENDPOINT_GQL_URL } from "./env.js"
import fetch from "node-fetch"

export function createGqlClient(
): Client {
  return createClient({
    url: ENDPOINT_GQL_URL,
    fetch: fetch as any,
    fetchOptions: () => {
      return {
        headers: {
          "Proxy-Authorization": process.env.PROXY_AUTHORIZATION_HEADER ?? "",
        },
      }
    },
    exchanges: [cacheExchange, fetchExchange],
  })
}

// Global is ok because this app stays small.
export const gqlClient = createGqlClient()
