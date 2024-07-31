import { gql } from '@urql/core';

export const DownloadQuery = gql`
  query DownloadQuery {
    note {
      id
      date
      body
      archived
      title
      updated_at
      version
      file {
        path
        title
      }
    }
  }
`

export const NoteIdQuery = gql`
  query NoteIdQuery {
    note {
      id
    }
  }
`