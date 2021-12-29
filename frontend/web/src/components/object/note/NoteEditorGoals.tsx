import { FormikProps } from "formik"
import React, { useContext, useEffect, useState } from "react"
import { useMutation, usePreloadedQuery } from "react-relay"
import { Options } from "react-select"
import { PayloadError } from "relay-runtime"
import { ObjectGeneric, OperationType } from ".."
import { getIdFromNodeId } from "../../../lib/hasura"
import { DataLoaderContext } from "../../DataLoader"
import { defaultGoalQuery } from "../../DataLoader.gql"
import EditorFormRowSelectButton from "../../mutation/EditorFormRowSelectButton"
import getMutationConfig from "../../mutation/getMutationConfig"
import { SelectButtonItem } from "../../ui/menu/SelectButtonMenu"
import { DataLoaderInnerGoalQuery } from "../../__generated__/DataLoaderInnerGoalQuery.graphql"
import { addNoteGoalsMutation, deleteNoteGoalsMutation } from "./NoteEdit.gql"
import { FormValues } from "./NoteEditor"
import { NoteGoalRef } from "./NoteFragment.gql"
import {
  NoteEditAddGoalsMutation,
  NoteEditAddGoalsMutationVariables,
} from "./__generated__/NoteEditAddGoalsMutation.graphql"
import {
  NoteEditDeleteGoalsMutation,
  NoteEditDeleteGoalsMutationVariables,
} from "./__generated__/NoteEditDeleteGoalsMutation.graphql"

type Item = SelectButtonItem<ObjectGeneric>

interface Props extends FormikProps<FormValues> {
  note?: ObjectGeneric
  noteGoals: NoteGoalRef[]
  operationType: OperationType
}

export default function NoteEditorGoals<T>(props: Props): JSX.Element {
  const {
    noteGoals,
    operationType,
    note,
    values: formValues,
    ...formikProps
  } = props

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<PayloadError[]>([])

  const [defaultSelectedItems, setDefaultSelectedItems] = useState<Item[]>([])
  const [items, setItems] = useState<Item[]>([])

  const { goalQueryRef } = useContext(DataLoaderContext)
  const data = usePreloadedQuery<DataLoaderInnerGoalQuery>(
    defaultGoalQuery,
    goalQueryRef
  )
  const [commitAddItems] = useMutation<NoteEditAddGoalsMutation>(
    addNoteGoalsMutation
  )
  const [commitDeleteItems] = useMutation<NoteEditDeleteGoalsMutation>(
    deleteNoteGoalsMutation
  )

  useEffect(
    () =>
      setDefaultSelectedItems(
        noteGoals.map(goal => ({
          id: goal.goal.id,
          value: goal.goal,
          label: goal.goal.title,
        }))
      ),
    [noteGoals, setDefaultSelectedItems]
  )
  useEffect(() => {
    const goals = data.goal_connection.edges
      .map(edge => edge.node)
      .filter(node => !node.archived)

    setItems(
      goals.map(goal => ({
        id: goal.id,
        value: goal,
        label: goal.title,
      }))
    )
  }, [data, setItems])

  async function submit(values: FormValues) {
    const { goals: selectedItemIds } = values

    const selectedItemMap = selectedItemIds.reduce((map, item) => {
      map[item] = undefined
      return map
    }, {})
    const defaultSelectedItemMap = defaultSelectedItems.reduce((map, item) => {
      map[item.id] = item
      return map
    }, {})

    const itemIdsToAdd: string[] = []
    const itemIdsToDelete: string[] = []

    for (const id of selectedItemIds) {
      if (!defaultSelectedItemMap.hasOwnProperty(id)) {
        itemIdsToAdd.push(id)
      }
    }

    for (const item of defaultSelectedItems) {
      if (!selectedItemMap.hasOwnProperty(item.id)) {
        itemIdsToDelete.push(item.id)
      }
    }

    await addItems(itemIdsToAdd)
    await deleteItems(itemIdsToDelete)
  }

  async function addItems(items: string[]) {
    setLoading(true)

    if (!note) {
      console.error("should not call addItems when note is not loaded")
      return
    }

    const objects = items.map(item => ({
      goal_id: getIdFromNodeId(item),
      note_id: getIdFromNodeId(note.id),
    }))

    const variables: NoteEditAddGoalsMutationVariables = {
      objects: objects,
    }

    const mutationConfig = getMutationConfig<NoteEditAddGoalsMutation>(
      variables,
      {
        setErrors,
        setLoading,
        onComplete: () => {},
      }
    )

    commitAddItems(mutationConfig)
  }

  async function deleteItems(items: string[]) {
    setLoading(true)

    if (!note) {
      console.error("should not call addItems when note is not loaded")
      return
    }

    const variables: NoteEditDeleteGoalsMutationVariables = {
      ids: items,
    }

    const mutationConfig = getMutationConfig<NoteEditDeleteGoalsMutation>(
      variables,
      {
        setErrors,
        setLoading,
        onComplete: () => {},
      }
    )

    commitDeleteItems(mutationConfig)
  }

  return (
    <EditorFormRowSelectButton
      values={formValues}
      {...formikProps}
      name="goals"
      label="Goals"
      items={items}
    />
  )
}
