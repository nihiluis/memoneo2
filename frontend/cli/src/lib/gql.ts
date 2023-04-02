import { createClient, Client } from "@urql/core"
import { ENDPOINT_GQL_URL } from "../constants/env"
import fetch from "node-fetch"
import { MemoneoInternalConfig } from "../shared/config"

export function createGqlClient(
  token: string,
  config: MemoneoInternalConfig
): Client {
  return createClient({
    url: ENDPOINT_GQL_URL,
    fetch: fetch as any,
    fetchOptions: () => {
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
          "X-Hasura-User-Id": config.userId,
        },
      }
    },
  })
}
