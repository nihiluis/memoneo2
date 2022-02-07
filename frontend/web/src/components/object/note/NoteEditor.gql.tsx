import { graphql } from "relay-runtime"

export const query = graphql`
  query NoteEditorDataQuery($id: uuid) {
    note_connection(first: 1, where: { id: { _eq: $id } })
      @connection(key: "NoteEditorDataQuery_note_connection") {
      edges {
        node {
          ...NoteFragment
        }
      }
    }
  }
`

export const mutation = graphql`
  mutation NoteEditorMutation(
    $title: String!
    $body: String!
    $pinned: Boolean!
    $date: date!
    $id: uuid
    $user_id: uuid
    $version: Int!
    $connections: [ID!]!
  ) {
    insert_note(
      objects: {
        title: $title
        body: $body
        pinned: $pinned
        date: $date
        id: $id
        user_id: $user_id
        version: $version
      }
      on_conflict: {
        constraint: note_pkey
        update_columns: [title, body, pinned, date, version]
      }
    ) {
      returning
        @appendNode(connections: $connections, edgeTypeName: "noteEdge") {
        id
        title
        pinned
        date
        body
        archived
        version
      }
    }
  }
`
