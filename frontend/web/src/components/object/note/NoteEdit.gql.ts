import { graphql } from "react-relay"

export const addNoteGoalsMutation = graphql`
  mutation NoteEditAddGoalsMutation($objects: [note_goal_insert_input!]!) {
    insert_note_goal(objects: $objects) {
      returning {
        note_id
        goal_id
      }
    }
  }
`

export const deleteNoteGoalMutation = graphql`
  mutation NoteEditDeleteGoalMutation($note_id: uuid!, $goal_id: uuid!) {
    delete_note_goal(
      where: {
        _and: { note_id: { _eq: $note_id }, goal_id: { _eq: $goal_id } }
      }
    ) {
      affected_rows
    }
  }
`

export const deleteNoteGoalsMutation = graphql`
  mutation NoteEditDeleteGoalsMutation($ids: [uuid!]!) {
    delete_note_goal(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`
