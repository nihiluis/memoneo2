import React, { Suspense, useContext, useState } from "react"
import { usePreloadedQuery } from "react-relay"
import { DataLoaderContext } from "../../DataLoader"
import { DataLoaderInnerGoalQuery } from "../../__generated__/DataLoaderInnerGoalQuery.graphql"
import {
  defaultActivityQuery,
  defaultGoalQuery,
  defaultNoteQuery,
  defaultTodoQuery,
} from "../../DataLoader.gql"
import {
  DEFAULT_ACTIVITY_CONNECTION,
  DEFAULT_GOAL_CONNECTION,
  DEFAULT_NOTE_CONNECTION,
  DEFAULT_TODO_CONNECTION,
} from "../../../constants/connections"
import LeftSidebarContent from "./LeftSidebarContent"
import LeftSidebarHeader from "./LeftSidebarHeader"
import { DataLoaderInnerActivityQuery } from "../../__generated__/DataLoaderInnerActivityQuery.graphql"
import { DataLoaderInnerTodoQuery } from "../../__generated__/DataLoaderInnerTodoQuery.graphql"
import { DataLoaderInnerNoteQuery } from "../../__generated__/DataLoaderInnerNoteQuery.graphql"

export default function LeftSidebar(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <LeftSidebarInner />
    </Suspense>
  )
}

function LeftSidebarInner(): JSX.Element {
  const [showArchived, setShowArchived] = useState(false)
  const {
    goalQueryRef,
    noteQueryRef,
    todoQueryRef,
    activityQueryRef,
  } = useContext(DataLoaderContext)

  const goalsData = usePreloadedQuery<DataLoaderInnerGoalQuery>(
    defaultGoalQuery,
    goalQueryRef
  )

  const activitiesData = usePreloadedQuery<DataLoaderInnerActivityQuery>(
    defaultActivityQuery,
    activityQueryRef
  )

  const todosData = usePreloadedQuery<DataLoaderInnerTodoQuery>(
    defaultTodoQuery,
    todoQueryRef
  )

  const notesData = usePreloadedQuery<DataLoaderInnerNoteQuery>(
    defaultNoteQuery,
    noteQueryRef
  )

  const defaultConfig = {}

  const notes = notesData.note_connection.edges
    .map(edge => edge.node)
    .filter(node => node.pinned)
  const goals = goalsData.goal_connection.edges.map(edge => edge.node)
  const activities = activitiesData.activity_connection.edges.map(
    edge => edge.node
  )
  const todos = todosData.todo_connection.edges.map(edge => edge.node)

  return (
    <div>
      <LeftSidebarHeader
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />
      <LeftSidebarContent
        title="Notes"
        type="note"
        items={notes}
        showArchived={showArchived}
        targetConnection={DEFAULT_NOTE_CONNECTION}
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Todos"
        type="todo"
        items={todos}
        showArchived={showArchived}
        targetConnection={DEFAULT_TODO_CONNECTION}
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Goals"
        type="goal"
        items={goals}
        showArchived={showArchived}
        targetConnection={DEFAULT_GOAL_CONNECTION}
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Activities"
        type="activity"
        showArchived={showArchived}
        items={activities}
        targetConnection={DEFAULT_ACTIVITY_CONNECTION}
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
    </div>
  )
}
