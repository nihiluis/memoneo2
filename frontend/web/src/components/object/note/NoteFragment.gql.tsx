import { graphql } from "react-relay"
import { NoteEditorDataQueryResponse } from "./__generated__/NoteEditorDataQuery.graphql"
import { NoteFragment } from "./__generated__/NoteFragment.graphql"

export type NoteRef = NoteEditorDataQueryResponse["note_connection"]["edges"][0]["node"]
export type NoteGoalRef = NoteFragment["note_goal_connection"]["edges"][0]["node"]

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
    note_goal_connection {
      edges {
        node {
          goal {
            id
            title
            description
          }
        }
      }
    }
  }
`

export const noteGoalFragment = graphql`
  fragment NoteFragmentGoal on goal {
    title
    description
  }
`
