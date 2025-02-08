import { gql } from "@urql/core"

export const InsertNoteMutation = gql`
  mutation InsertNoteMutation($inputs: [note_insert_input!]!) {
    insert_note(
      objects: $inputs
      on_conflict: { constraint: note_pkey, update_columns: [title, body, body_iv] }
    ) {
      returning {
        id
        title
        body
        date
        version
      }
    }
  }
`