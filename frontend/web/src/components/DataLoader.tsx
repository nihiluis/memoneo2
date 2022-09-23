import React, { PropsWithChildren, Suspense, useEffect, useState } from "react"
import { PreloadedQuery, useQueryLoader } from "react-relay"
import { OperationType } from "relay-runtime"
import { getStaticProps } from "../../pages"
import {
  defaultGoalQuery,
  defaultNoteQuery,
  defaultActivityQuery,
  defaultTodoQuery,
} from "./DataLoader.gql"
import { DataLoaderInnerActivityQuery } from "./__generated__/DataLoaderInnerActivityQuery.graphql"
import { DataLoaderInnerGoalQuery } from "./__generated__/DataLoaderInnerGoalQuery.graphql"
import { DataLoaderInnerNoteQuery } from "./__generated__/DataLoaderInnerNoteQuery.graphql"
import { DataLoaderInnerTodoQuery } from "./__generated__/DataLoaderInnerTodoQuery.graphql"

type QueryRefAlias<T extends OperationType> = PreloadedQuery<
  T,
  Record<string, unknown>
>
type GoalQueryRef = QueryRefAlias<DataLoaderInnerGoalQuery>
type NoteQueryRef = QueryRefAlias<DataLoaderInnerNoteQuery>
type ActivityQueryRef = QueryRefAlias<DataLoaderInnerActivityQuery>
type TodoQueryRef = QueryRefAlias<DataLoaderInnerTodoQuery>

interface DataLoaderContextValues {
  goalQueryRef: GoalQueryRef
  setGoalQueryRef(ref: GoalQueryRef): void
  todoQueryRef: TodoQueryRef
  setTodoQueryRef(ref: TodoQueryRef): void
  noteQueryRef: NoteQueryRef
  setNoteQueryRef(ref: NoteQueryRef): void
  activityQueryRef: ActivityQueryRef
  setActivityQueryRef(ref: ActivityQueryRef): void
}

export const DataLoaderContext = React.createContext<DataLoaderContextValues>(
  undefined
)

export default function DataLoader(props: PropsWithChildren<{}>): JSX.Element {
  const [goalQueryRef, setGoalQueryRef] = useState<GoalQueryRef>(undefined)
  const [noteQueryRef, setNoteQueryRef] = useState<NoteQueryRef>(undefined)
  const [activityQueryRef, setActivityQueryRef] = useState<ActivityQueryRef>(
    undefined
  )
  const [todoQueryRef, setTodoQueryRef] = useState<TodoQueryRef>(undefined)

  const contextData = {
    goalQueryRef,
    todoQueryRef,
    noteQueryRef,
    activityQueryRef,
    setGoalQueryRef,
    setTodoQueryRef,
    setNoteQueryRef,
    setActivityQueryRef,
  }

  // console.log(contextData)

  return (
    <DataLoaderContext.Provider value={contextData}>
      <DataLoaderInner {...contextData}>{props.children}</DataLoaderInner>
    </DataLoaderContext.Provider>
  )
}

function DataLoaderInner(
  props: PropsWithChildren<DataLoaderContextValues>
): JSX.Element {
  const [
    goalQueryRefRaw,
    loadGoalQuery,
  ] = useQueryLoader<DataLoaderInnerGoalQuery>(defaultGoalQuery)
  const [
    noteQueryRefRaw,
    loadNoteQuery,
  ] = useQueryLoader<DataLoaderInnerNoteQuery>(defaultNoteQuery)
  const [
    activityQueryRefRaw,
    loadActivityQuery,
  ] = useQueryLoader<DataLoaderInnerActivityQuery>(defaultActivityQuery)
  const [
    todoQueryRefRaw,
    loadTodoQuery,
  ] = useQueryLoader<DataLoaderInnerTodoQuery>(defaultTodoQuery)

  useEffect(() => {
    loadGoalQuery({})
    loadNoteQuery({})
    loadActivityQuery({})
    loadTodoQuery({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    children,
    setGoalQueryRef,
    setNoteQueryRef,
    setActivityQueryRef,
    setTodoQueryRef,
  } = props

  useEffect(() => setGoalQueryRef(goalQueryRefRaw), [
    goalQueryRefRaw,
    setGoalQueryRef,
  ])
  useEffect(() => setNoteQueryRef(noteQueryRefRaw), [
    noteQueryRefRaw,
    setNoteQueryRef,
  ])
  useEffect(() => setActivityQueryRef(activityQueryRefRaw), [
    activityQueryRefRaw,
    setActivityQueryRef,
  ])
  useEffect(() => setTodoQueryRef(todoQueryRefRaw), [
    todoQueryRefRaw,
    setTodoQueryRef,
  ])

  const { goalQueryRef, noteQueryRef, activityQueryRef, todoQueryRef } = props

  if (!goalQueryRef || !noteQueryRef || !activityQueryRef || !todoQueryRef) {
    return null
  }

  return <React.Fragment>{children}</React.Fragment>
}
