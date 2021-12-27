import { FormikProps } from "formik"
import React, { useContext, useEffect, useState } from "react"
import { usePreloadedQuery } from "react-relay"
import { Options } from "react-select"
import { DataLoaderContext } from "../../DataLoader"
import { defaultGoalQuery } from "../../DataLoader.gql"
import EditorFormRowSelect from "../../mutation/EditorFormRowSelect"
import { Option } from "../../ui/form/FormRowSelect"
import { DataLoaderInnerGoalQuery } from "../../__generated__/DataLoaderInnerGoalQuery.graphql"
import { NoteGoalRef } from "./NoteFragment.gql"
import { NoteFragmentGoal } from "./__generated__/NoteFragmentGoal.graphql"

interface Props<T> extends FormikProps<T> {
  noteGoals: NoteGoalRef[]
}

export default function NoteEditorGoals<T>(props: Props<T>): JSX.Element {
  const { noteGoals, ...formikProps } = props

  const [selectedOptions, setSelectedOptions] = useState<Options<Option>>([])
  const [options, setOptions] = useState<Options<Option>>([])

  const { goalQueryRef } = useContext(DataLoaderContext)
  const data = usePreloadedQuery<DataLoaderInnerGoalQuery>(
    defaultGoalQuery,
    goalQueryRef
  )

  useEffect(
    () =>
      setSelectedOptions(
        noteGoals.map(goal => ({ value: goal.goal.id, label: goal.goal.title }))
      ),
    [noteGoals, setSelectedOptions]
  )
  useEffect(() => {
    const goals = data.goal_connection.edges
      .map(edge => edge.node)
      .filter(node => !node.archived)

    setOptions(goals.map(goal => ({ value: goal.id, label: goal.title })))
  }, [data, setOptions])

  return (
    <EditorFormRowSelect
      {...formikProps}
      name="goals"
      label="Goals"
      options={options}
    />
  )
}
