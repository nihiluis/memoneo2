import {
  ConnectionHandler,
  RecordSourceSelectorProxy,
  ROOT_ID,
} from "relay-runtime"

export default function deleteInConnection<T>(
  store: RecordSourceSelectorProxy<T>,
  connectionName: string,
  connectionConfig: any,
  id: string,
  storeId: string = ROOT_ID
) {
  const baseRecord = store.get(storeId)

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
