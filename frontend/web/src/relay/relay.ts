import { Environment, Network, RecordSource, Store } from "relay-runtime"
import fetchGraphQL from "./fetchGraphQL"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { useMemo } from "react"

// Relay passes a "params" object with the query name and text. So we define a helper function
// to call our fetchGraphQL utility with params.text.
async function fetchRelay(params: any, variables: any) {
  console.log(`fetching query ${params.name} with ${JSON.stringify(variables)}`)
  return fetchGraphQL(params.text, variables)
}

let relayEnvironment: RelayModernEnvironment

function createEnvironment(initialRecords?: any) {
  return new Environment({
    // Create a network layer from the fetch function
    network: Network.create(fetchRelay),
    store: new Store(new RecordSource(), {
      // This property tells Relay to not immediately clear its cache when the user
      // navigates around the app. Relay will hold onto the specified number of
      // query results, allowing the user to return to recently visited pages
      // and reusing cached data if its available/fresh.
      gcReleaseBufferSize: 10,
    }),
  })
}

export function initEnvironment(initialRecords?: any) {
  // Create a network layer from the fetch function
  const environment = relayEnvironment ?? createEnvironment(initialRecords)

  // If your page has Next.js data fetching methods that use Relay, the initial records
  // will get hydrated here
  if (initialRecords) {
    environment.getStore().publish(new RecordSource(initialRecords))
  }
  // For SSG and SSR always create a new Relay environment
  if (typeof window === "undefined") return environment
  // Create the Relay environment once in the client
  if (!relayEnvironment) relayEnvironment = environment

  return relayEnvironment
}

export function useEnvironment(initialRecords?: any) {
  const store = useMemo(() => initEnvironment(initialRecords), [initialRecords])
  return store
}
