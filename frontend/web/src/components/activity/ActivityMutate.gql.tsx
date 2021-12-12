import { graphql } from "relay-runtime"

export const mutation = graphql`
  mutation ActivityMutateMutation(
    $title: String!
    $description: String!
    $id: uuid
    $user_id: uuid
    $connections: [ID!]!
  ) {
    insert_activity(
      objects: {
        title: $title
        description: $description
        id: $id
        user_id: $user_id
      }
      on_conflict: {
        constraint: activity_pkey
        update_columns: [title, description]
      }
    ) {
      returning @appendNode(connections: $connections, edgeTypeName: "activityEdge") {
        id
        title
        description
        rank
        archived
      }
    }
  }
`
