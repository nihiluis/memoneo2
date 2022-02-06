import { gql } from "@urql/core"

export const InsertNoteMutation = gql`
  mutation InsertNoteMutation($inputs: [note_insert_input!]!) {
    insert_note(
      objects: $inputs
      on_conflict: { constraint: note_pkey, update_columns: [title, body] }
    ) {
      returning {
        id
        title
        body
        date
      }
    }
  }
`

export const InsertNoteFileDataMutation = gql`
  mutation InsertFileDataMutation($inputs: [file_data_insert_input!]!) {
    insert_file_data(objects: $inputs) {
      affected_rows
    }
  }
`
