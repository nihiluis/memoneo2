import { graphql } from "relay-runtime"

export const mutation = graphql`
  mutation NoteEditorMutation(
    $title: String!
    $body: String!
    $pinned: Boolean!
    $date: date!
    $id: uuid
    $user_id: uuid
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
      }
      on_conflict: {
        constraint: note_pkey
        update_columns: [title, body, pinned, date]
      }
    ) {
      returning
        @appendNode(connections: $connections, edgeTypeName: "noteEdge") {
        id
        title
        date
        body
        archived
      }
    }
  }
`
