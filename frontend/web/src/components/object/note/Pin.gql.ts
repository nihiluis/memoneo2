import { graphql } from "react-relay"

export const pinNoteMutation = graphql`
  mutation PinNoteMutation($id: uuid!, $pinned: Boolean!) {
    update_note(where: { id: { _eq: $id } }, _set: { pinned: $pinned }) {
      affected_rows
      returning {
        id
        pinned
      }
    }
  }
`
