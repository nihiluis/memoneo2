import { graphql } from "react-relay"

export const archiveAllMutation = graphql`
  mutation ArchiveAllMutation(
    $id: uuid!
    $archived: Boolean!
  ) {
    update_goal(where: { id: { _eq: $id } }, _set: { archived: $archived }) {
      affected_rows
      returning {
        id
        archived
      }
    }
    update_note(where: { id: { _eq: $id } }, _set: { archived: $archived }) {
      affected_rows
      returning {
        id
        archived
      }
    }
    update_todo(where: { id: { _eq: $id } }, _set: { archived: $archived }) {
      affected_rows
      returning {
        id
        archived
      }
    }
    update_activity(
      where: { id: { _eq: $id } }
      _set: { archived: $archived }
    ) {
      affected_rows
      returning {
        id
        archived
      }
    }
  }
`

export const archiveGoalMutation = graphql`
  mutation ArchiveGoalMutation(
    $id: uuid!
    $archived: Boolean!
  ) {
    update_goal(where: { id: { _eq: $id } }, _set: { archived: $archived }) {
      affected_rows
      returning {
        id
        archived
      }
    }
  }
`

export const archiveTodoMutation = graphql`
  mutation ArchiveTodoMutation(
    $id: uuid!
    $archived: Boolean!
  ) {
    update_todo(where: { id: { _eq: $id } }, _set: { archived: $archived }) {
      affected_rows
      returning {
        id
        archived
      }
    }
  }
`

export const archiveNoteMutation = graphql`
  mutation ArchiveNoteMutation(
    $id: uuid!
    $archived: Boolean!
  ) {
    update_note(where: { id: { _eq: $id } }, _set: { archived: $archived }) {
      affected_rows
      returning {
        id
        archived
      }
    }
  }
`

export const archiveActivityMutation = graphql`
  mutation ArchiveActivityMutation(
    $id: uuid!
    $archived: Boolean!
  ) {
    update_activity(
      where: { id: { _eq: $id } }
      _set: { archived: $archived }
    ) {
      affected_rows
      returning {
        id
        archived
      }
    }
  }
`
