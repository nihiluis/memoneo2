import { graphql } from "relay-runtime"

export const mutation = graphql`
  mutation TodoMutateMutation(
    $title: String!
    $id: uuid
    $user_id: uuid
    $connections: [ID!]!
  ) {
    insert_todo(
      objects: {
        title: $title
        id: $id
        user_id: $user_id
      }
      on_conflict: {
        constraint: todo_pkey
        update_columns: [title]
      }
    ) {
      returning @appendNode(connections: $connections, edgeTypeName: "todoEdge") {
        id
        title
        rank
        archived
      }
    }
  }
`
