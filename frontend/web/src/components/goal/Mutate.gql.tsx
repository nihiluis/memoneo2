import { graphql } from "relay-runtime"


export const mutation = graphql`
  mutation MutateGoalFormMutation(
    $title: String!
    $description: String!
    $id: uuid
  ) {
    insert_goal_one(
      object: {
        title: $title
        description: $description
        id: $id
      }
      on_conflict: {
        constraint: goal_pkey
        update_columns: [title, description]
      }
    ) {
      id
    }
  }
`
