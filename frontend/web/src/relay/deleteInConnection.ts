import {
  ConnectionHandler,
  RecordProxy,
  RecordSourceSelectorProxy,
  ROOT_ID,
} from "relay-runtime"

export default function deleteInConnection<T>(
  store: RecordSourceSelectorProxy<T>,
  connectionName: string,
  connectionConfig: any,
  id: string
) {
  const baseRecord = store.get(ROOT_ID)

  const connectionRecord = ConnectionHandler.getConnection(
    baseRecord,
    connectionName,
    connectionConfig
  )

  if (!connectionRecord) {
    throw Error("connectionRecord may not be empty")
  }

  //const newRecord = store.create(id, "recently_viewed_document")

  ConnectionHandler.deleteNode(connectionRecord, id)
}
