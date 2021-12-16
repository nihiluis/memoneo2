import { graphql } from "react-relay";

export const noteFragment = graphql`
  fragment NoteFragment on note {
    id
    title
    body
    pinned
    archived
    date
    updated_at
    created_at
  }
`
