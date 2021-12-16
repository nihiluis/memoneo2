import { graphql } from "react-relay"

export const deleteAllMutation = graphql`
  mutation DeleteAllMutation($id: uuid!, $connections: [ID!]!) {
    delete_goal(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
    delete_activity(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
    delete_note(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
    delete_todo(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
  }
`

export const deleteGoalMutation = graphql`
  mutation DeleteGoalMutation($id: uuid!, $connections: [ID!]!) {
    delete_goal(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
  }
`

export const deleteActivityMutation = graphql`
  mutation DeleteActivityMutation($id: uuid!, $connections: [ID!]!) {
    delete_activity(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
  }
`

export const deleteNoteMutation = graphql`
  mutation DeleteNoteMutation($id: uuid!, $connections: [ID!]!) {
    delete_note(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
  }
`

export const deleteTodoMutation = graphql`
  mutation DeleteTodoMutation($id: uuid!, $connections: [ID!]!) {
    delete_todo(where: { id: { _eq: $id } }) {
      returning @deleteEdge(connections: $connections) {
        id
      }
    }
  }
`
