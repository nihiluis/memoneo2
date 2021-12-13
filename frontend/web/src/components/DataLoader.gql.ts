import { graphql } from "react-relay"

export const defaultGoalQuery = graphql`
  query DataLoaderInnerGoalQuery {
    goal_connection(first: 10000)
      @connection(key: "DataLoaderInnerGoalQuery_goal_connection") {
      edges {
        node {
          id
          description
          title
          status
          progress
          rank
          archived
        }
      }
    }
  }
`

export const defaultNoteQuery = graphql`
  query DataLoaderInnerNoteQuery {
    note_connection(first: 10000, order_by: { updated_at: desc })
      @connection(key: "DataLoaderInnerNoteQuery_note_connection") {
      edges {
        node {
          id
          title
          pinned
          date
          archived
        }
      }
    }
  }
`

export const defaultActivityQuery = graphql`
  query DataLoaderInnerActivityQuery {
    activity_connection(first: 10000)
      @connection(key: "DataLoaderInnerActivityQuery_activity_connection") {
      edges {
        node {
          id
          title
          archived
        }
      }
    }
  }
`

export const defaultTodoQuery = graphql`
  query DataLoaderInnerTodoQuery {
    todo_connection(first: 10000)
      @connection(key: "DataLoaderInnerTodoQuery_todo_connection") {
      edges {
        node {
          id
          title
          archived
        }
      }
    }
  }
`
