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
        version
      }
    }
  }
`

export const UpdateNoteMutation = gql`
  mutation UpdateNoteMutation(
    $id: uuid!
    $title: String!
    $body: String!
    $version: Int!
    $date: date!
  ) {
    update_note_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, body: $body, version: $version, date: $date }
    ) {
      title
      body
      date
      updated_at
      version
    }
  }
`

export const ArchiveNoteMutation = gql`
  mutation ArchiveNoteMutation(
    $id: uuid!
    $archived: Boolean!
  ) {
    update_note_by_pk(
      pk_columns: { id: $id }
      _set: { archived: $archived }
    ) {
      archived
    }
  }
`

export const ArchiveNotesMutation = gql`
mutation ArchiveNotesMutation($ids: [uuid!]) {
  update_note(where: {id: {_in: $ids}}, _set: {archived: true}) {
    affected_rows
  }
}
`

export const InsertNoteFileDataMutation = gql`
  mutation InsertFileDataMutation($inputs: [file_data_insert_input!]!) {
    insert_file_data(objects: $inputs, on_conflict: {constraint: file_data_pkey, update_columns: [path, title]}) {
      affected_rows
    }
  }
`

export const UpdateNoteFileDataMutation = gql`
  mutation UpdateNoteFileDataMutation(
    $note_id: uuid!
    $title: String!
    $path: String!
  ) {
    update_file_data_by_pk(
      pk_columns: { note_id: $note_id }
      _set: { title: $title, path: $path }
    ) {
      title
      path
    }
  }
`
