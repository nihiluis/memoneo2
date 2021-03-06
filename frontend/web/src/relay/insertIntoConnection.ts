import {
  ConnectionHandler,
  RecordSourceSelectorProxy,
  ROOT_ID,
} from "relay-runtime"

interface ConnectionInfo {
  config: any
  name: string
  rootField: string
}

export function insertIntoConnections<T>(
  store: RecordSourceSelectorProxy<T>,
  infos: ConnectionInfo[],
  id: string,
  edgeType: string
) {}

export default function insertIntoConnection<T>(
  store: RecordSourceSelectorProxy<T>,
  connectionName: string,
  connectionConfig: any,
  id: string,
  rootField: string,
  edgeType: string,
  newId: string
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
