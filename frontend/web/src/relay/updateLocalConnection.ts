import {
  ConnectionHandler,
  RecordSourceSelectorProxy,
  ROOT_ID,
} from "relay-runtime"

export default function updateLocalConnection<T>(
  store: RecordSourceSelectorProxy<T>,
  connectionName: string,
  id: string,
  rootField: string,
  edgeType: string,
  newId: string
) {
  const baseRecord = store.get(ROOT_ID)

  const connectionConfig = {
    order_by: { title: "asc" },
  }

  if (id) {
    connectionConfig["where"] = { id: { _eq: id } }
  }

  const connectionRecord = ConnectionHandler.getConnection(
    baseRecord,
    connectionName,
    connectionConfig
  )

  if (!connectionRecord) {
    throw Error("connectionRecord may not be empty")
  }

  const payload = store.getRootField(rootField)

  //const newRecord = store.create(id, "recently_viewed_document")

  const newEdge = ConnectionHandler.createEdge(
    store,
    connectionRecord,
    payload,
    edgeType
  )

  newEdge.setValue(newId, "cursor")

  ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge)
}
