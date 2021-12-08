import { graphql } from "react-relay"

export const deleteMutation = graphql`
  mutation LeftSidebarItemMenuDeleteMutation($id: uuid!) {
    delete_goal_by_pk(id: $id) {
      id
    }
    delete_todo_by_pk(id: $id) {
      id
    }
    delete_activity_by_pk(id: $id) {
      id
    }
    delete_note_by_pk(id: $id) {
      id
    }
  }
`

export const archiveAllMutation = graphql`
  mutation LeftSidebarItemMenuArchiveAllMutation(
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
    update_activity(where: { id: { _eq: $id } }, _set: { archived: $archived }) {
      affected_rows
      returning {
        id
        archived
      }
    }
  }
`

export const archiveGoalMutation = graphql`
  mutation LeftSidebarItemMenuArchiveGoalMutation(
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
  mutation LeftSidebarItemMenuArchiveTodoMutation(
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
  mutation LeftSidebarItemMenuArchiveNoteMutation(
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
  mutation LeftSidebarItemMenuArchiveActivityMutation(
    $id: uuid!
    $archived: Boolean!
  ) {
    update_activity(where: { id: { _eq: $id } }, _set: { archived: $archived }) {
      affected_rows
      returning {
        id
        archived
      }
    }
  }
`
