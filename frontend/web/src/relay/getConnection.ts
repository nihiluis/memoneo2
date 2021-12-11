import { ConnectionHandler } from "react-relay"
import { ROOT_ID } from "relay-runtime"

export function getRootConnectionIds(
  connectionName: string,
  filters: unknown[]
) {
  if (filters.length === 0) {
    return [ConnectionHandler.getConnectionID(ROOT_ID, connectionName)]
  }

  return filters.map(filter =>
    ConnectionHandler.getConnectionID(ROOT_ID, connectionName, filter)
  )
}
