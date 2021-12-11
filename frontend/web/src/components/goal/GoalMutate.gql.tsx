import { graphql } from "relay-runtime"

export const mutation = graphql`
  mutation GoalMutateMutation(
    $title: String!
    $description: String!
    $id: uuid
    $user_id: uuid
    $connections: [ID!]!
  ) {
    insert_goal(
      objects: {
        title: $title
        description: $description
        id: $id
        user_id: $user_id
      }
      on_conflict: {
        constraint: goal_pkey
        update_columns: [title, description]
      }
    ) {
      returning
        @appendNode(connections: $connections, edgeTypeName: "goalEdge") {
        id
        title
        description
        status
        progress
        rank
        archived
      }
    }
  }
`
