import { ArchiveIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import React, { useState } from "react"
import { graphql, useMutation, UseMutationConfig } from "react-relay"
import { PayloadError } from "relay-runtime"
import { getIdFromNodeId } from "../../lib/hasura"
import deleteInConnection from "../../relay/deleteInConnection"
import { DropdownMenuItem } from "../ui/menu/DropdownMenu"
import { LeftSidebarItemMenuDeleteMutation } from "./__generated__/LeftSidebarItemMenuDeleteMutation.graphql"

const deleteMutation = graphql`
  mutation LeftSidebarItemMenuDeleteMutation($id: uuid!) {
    delete_goal_by_pk(id: $id) {
      id
    }
    delete_todo_by_pk(id: $id) {
      id
    }
    delete_activity_by_pk(id: $id) {
      id
    }
    delete_note_by_pk(id: $id) {
      id
    }
  }
`

interface Props {
  item: { id: string }
  targetConnection: string
  targetConnectionConfig: any
}

export default function LeftSidebarItemMenu(props: Props): JSX.Element {
  const [commit, _] = useMutation<LeftSidebarItemMenuDeleteMutation>(
    deleteMutation
  )
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  function onDelete() {
    setLoading(true)

    const variables: any = {
      id: getIdFromNodeId(props.item.id),
    }

    const mutationConfig: UseMutationConfig<LeftSidebarItemMenuDeleteMutation> = {
      variables,
      onError: error => {
        console.error(error)
        setErrors([error])
        setLoading(false)
      },
      onCompleted: (response, errors) => {
        setLoading(false)
        setErrors(errors ?? [])

        if (errors && errors.length !== 0) {
          console.error("found errors " + JSON.stringify(errors))
          return
        }
      },
      updater: store => {
        deleteInConnection(
          store,
          props.targetConnection,
          props.targetConnectionConfig,
          props.item.id
        )
      },
    }

    commit(mutationConfig)
  }

  return (
    <React.Fragment>
      <DropdownMenuItem className="flex gap-2">
        <Pencil1Icon color="var(--icon-color)" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem className="flex gap-2">
        <ArchiveIcon color="var(--icon-color)" />
        Archive
      </DropdownMenuItem>
      <DropdownMenuItem className="flex gap-2" onClick={onDelete}>
        <TrashIcon color="var(--icon-color)" />
        Delete
      </DropdownMenuItem>
    </React.Fragment>
  )
}
