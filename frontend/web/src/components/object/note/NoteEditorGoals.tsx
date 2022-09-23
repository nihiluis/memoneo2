import { FormikProps } from "formik"
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { useMutation, usePreloadedQuery } from "react-relay"
import { Options } from "react-select"
import { PayloadError } from "relay-runtime"
import { ObjectGeneric, OperationType } from ".."
import { NOTE_EDITOR_GOAL_CONNECTION } from "../../../constants/connections"
import { getIdFromNodeId } from "../../../lib/hasura"
import deleteInConnection from "../../../relay/deleteInConnection"
import { getRootConnectionIds } from "../../../relay/getConnection"
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
  currentSelectedItems: NoteGoalRef[]
  operationType: OperationType
}

export interface NoteEditorGoalsHandle {
  submit: (noteId: string, values: FormValues) => void
}

const NoteEditorGoals = forwardRef<NoteEditorGoalsHandle, Props>(
  (props, ref) => {
    const {
      currentSelectedItems,
      operationType,
      note,
      values: formValues,
      ...formikProps
    } = props

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<PayloadError[]>([])

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

    // note: the id from the n_m table has to be deleted. for the select menu we use the goal ids however. this is confusing!
    useImperativeHandle(ref, () => ({
      async submit(noteId: string, values: FormValues) {
        const { goals: selectedItemIds } = values

        const selectedItemMap = selectedItemIds.reduce((map, item) => {
          map[item] = undefined
          return map
        }, {})
        const defaultSelectedItemMap = currentSelectedItems.reduce(
          (map, item) => {
            map[item.goal.id] = item
            return map
          },
          {}
        )

        const itemIdsToAdd: string[] = []
        const itemIdsToDelete: string[] = []

        for (const id of selectedItemIds) {
          if (!defaultSelectedItemMap.hasOwnProperty(id)) {
            itemIdsToAdd.push(id)
          }
        }

        for (const item of currentSelectedItems) {
          if (!selectedItemMap.hasOwnProperty(item.goal.id)) {
            itemIdsToDelete.push(item.id)
          }
        }

        if (itemIdsToAdd.length > 0) {
          await addItems(noteId, itemIdsToAdd)
        }
        if (itemIdsToDelete.length > 0) {
          await deleteItems(noteId, itemIdsToDelete)
        }
      },
    }))

    async function addItems(noteId: string, items: string[]) {
      setLoading(true)

      if (!noteId) {
        console.error("should not call addItems when noteId is undefined")
        return
      }

      const objects = items.map(item => ({
        // TODO it should be clear from code where deencoding is needed, this is intransparent atm
        goal_id: getIdFromNodeId(item),
        note_id: getIdFromNodeId(noteId),
      }))

      const variables: NoteEditAddGoalsMutationVariables = {
        objects: objects,
        connections: [
          ...getRootConnectionIds(NOTE_EDITOR_GOAL_CONNECTION, [], noteId),
        ],
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

    async function deleteItems(noteId: string, itemIds: string[]) {
      setLoading(true)

      const variables: NoteEditDeleteGoalsMutationVariables = {
        ids: itemIds.map(id => getIdFromNodeId(id)),
      }

      const mutationConfig = getMutationConfig<NoteEditDeleteGoalsMutation>(
        variables,
        {
          setErrors,
          setLoading,
          onComplete: () => {},
          updater: store => {
            for (const itemId of itemIds) {
              deleteInConnection(
                store,
                NOTE_EDITOR_GOAL_CONNECTION,
                {},
                itemId,
                noteId
              )
            }
          },
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
)

NoteEditorGoals.displayName = "NoteEditorGoals"

export default NoteEditorGoals
