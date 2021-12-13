import { graphql } from "react-relay"

export const deleteGoalMutation = graphql`
  mutation LeftSidebarItemMenuDeleteGoalMutation(
    $id: uuid!
    $connections: [ID!]!
  ) {
    delete_goal(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
  }
`

export const deleteActivityMutation = graphql`
  mutation LeftSidebarItemMenuDeleteActivityMutation(
    $id: uuid!
    $connections: [ID!]!
  ) {
    delete_activity(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
  }
`

export const deleteNoteMutation = graphql`
  mutation LeftSidebarItemMenuDeleteNoteMutation(
    $id: uuid!
    $connections: [ID!]!
  ) {
    delete_note(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
  }
`

export const deleteTodoMutation = graphql`
  mutation LeftSidebarItemMenuDeleteTodoMutation(
    $id: uuid!
    $connections: [ID!]!
  ) {
    delete_todo(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
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
