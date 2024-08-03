import { gql } from '@urql/core';

export const DownloadQuery = gql`
  query DownloadQuery {
    note(where: {archived: {_eq: false}}) {
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
    note(where: {archived: {_eq: false}}) {
      id
      title
    }
  }
`

// export const NoteIdByPathQuery = gql`
// query NoteIdByPathQuery($path: String!) {
//   note(where: {file: {path: {_eq: $path}}}) {
//     id
//     file {
//       path
//     }
//   }
// }
// `