import { FormikProps } from "formik"
import React, { useContext, useEffect, useState } from "react"
import { usePreloadedQuery } from "react-relay"
import { Options } from "react-select"
import { DataLoaderContext } from "../../DataLoader"
import { defaultGoalQuery } from "../../DataLoader.gql"
import EditorFormRowSelectButton from "../../mutation/EditorFormRowSelectButton"
import { Item } from "../../ui/form/FormRowSelectButton"
import { DataLoaderInnerGoalQuery } from "../../__generated__/DataLoaderInnerGoalQuery.graphql"
import { NoteGoalRef } from "./NoteFragment.gql"

interface Props<T> extends FormikProps<T> {
  noteGoals: NoteGoalRef[]
}

export default function NoteEditorGoals<T>(props: Props<T>): JSX.Element {
  const { noteGoals, ...formikProps } = props

  const [defaultSelectedOptions, setDefaultSelectedOptions] = useState<
    Options<Item>
  >([])
  const [items, setItems] = useState<Item[]>([])

  const { goalQueryRef } = useContext(DataLoaderContext)
  const data = usePreloadedQuery<DataLoaderInnerGoalQuery>(
    defaultGoalQuery,
    goalQueryRef
  )

  useEffect(
    () =>
      setDefaultSelectedOptions(
        noteGoals.map(goal => ({ value: goal.goal.id, label: goal.goal.title }))
      ),
    [noteGoals, setDefaultSelectedOptions]
  )
  useEffect(() => {
    const goals = data.goal_connection.edges
      .map(edge => edge.node)
      .filter(node => !node.archived)

    setItems(goals.map(goal => ({ value: goal.id, label: goal.title })))
  }, [data, setItems])

  return (
    <EditorFormRowSelectButton
      {...formikProps}
      name="goals"
      label="Goals"
      items={items}
    />
  )
}
