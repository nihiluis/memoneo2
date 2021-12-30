import { ConnectionHandler } from "react-relay"
import { ROOT_ID } from "relay-runtime"

export function getRootConnectionIds(
  connectionName: string,
  filters: unknown[],
  storeId: string = ROOT_ID
) {
  if (filters.length === 0) {
    return [ConnectionHandler.getConnectionID(storeId, connectionName)]
  }

  return filters.map(filter =>
    ConnectionHandler.getConnectionID(storeId, connectionName, filter)
  )
}
