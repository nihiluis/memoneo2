import { ArchiveIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import React, { useState } from "react"
import { graphql, useMutation, UseMutationConfig } from "react-relay"
import { PayloadError } from "relay-runtime"
import { getIdFromNodeId } from "../../lib/hasura"
import deleteInConnection from "../../relay/deleteInConnection"
import { MemoObjectType } from "../types"
import { DropdownMenuItem } from "../ui/menu/DropdownMenu"
import { archiveAllMutation, deleteMutation } from "./LeftSidebarItemMenu.gql"
import { LeftSidebarItemMenuArchiveAllMutation } from "./__generated__/LeftSidebarItemMenuArchiveAllMutation.graphql"
import { LeftSidebarItemMenuDeleteMutation } from "./__generated__/LeftSidebarItemMenuDeleteMutation.graphql"


interface Props {
  item: { id: string; archived: boolean }
  type: MemoObjectType
  targetConnection: string
  targetConnectionConfig: any
}

export default function LeftSidebarItemMenu(props: Props): JSX.Element {
  const [commitDelete] = useMutation<LeftSidebarItemMenuDeleteMutation>(
    deleteMutation
  )
  const [commitArchive] = useMutation<LeftSidebarItemMenuArchiveAllMutation>(
    archiveAllMutation
  )
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  function onDelete() {
    console.log("big")
    setLoading(true)
    console.log("boy")

    const variables: any = {
      id: getIdFromNodeId(props.item.id),
    }

    const mutationConfig: UseMutationConfig<LeftSidebarItemMenuDeleteMutation> = {
      variables,
      onError: error => {
        console.error(error)
        console.log("HEHEHEHE")
        setErrors([error])
        setLoading(false)
      },
      onCompleted: (response, errors) => {
        console.log("ODJYD")
        setLoading(false)
        setErrors(errors ?? [])
        console.log("BABHAHHA")

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

    commitDelete(mutationConfig)
  }

  function onArchive() {
    console.log("OMG")
    setLoading(true)
    console.log("UDASJKD")

    const variables = {
      id: getIdFromNodeId(props.item.id),
      archived: !props.item.archived,
    }

    const mutationConfig: UseMutationConfig<LeftSidebarItemMenuArchiveAllMutation> = {
      variables,
      onError: error => {
        console.log("BURR)")
        console.error(error)
        setErrors([error])
        setLoading(false)
        console.log("KDKADS")
      },
      onCompleted: (response, errors) => {
        console.log("DHJASD")
        setLoading(false)
        setErrors(errors ?? [])
        console.log("HEAL")

        if (errors && errors.length !== 0) {
          console.error("found errors " + JSON.stringify(errors))
          return
        }
      },
      optimisticUpdater: store => {
        const record = store.get(props.item.id)

        if (!record) {
          console.error(`unable to find record for item ${props.item.id}`)
          return
        }

        console.log("LOOOL")
        record.setValue(variables.archived, "archived")
        console.log("BIG")
      },
      
    }

    commitArchive(mutationConfig)
  }

  return (
    <React.Fragment>
      <DropdownMenuItem className="flex gap-2">
        <Pencil1Icon color="var(--icon-color)" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem className="flex gap-2" onClick={onArchive}>
        <ArchiveIcon color="var(--icon-color)" />
        {props.item.archived ? "Recover" : "Archive"}
      </DropdownMenuItem>
      <DropdownMenuItem className="flex gap-2" onClick={onDelete}>
        <TrashIcon color="var(--icon-color)" />
        Delete
      </DropdownMenuItem>
    </React.Fragment>
  )
}
