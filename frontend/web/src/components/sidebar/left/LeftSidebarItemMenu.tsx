import { ArchiveIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { graphql, useMutation, UseMutationConfig } from "react-relay"
import { PayloadError } from "relay-runtime"
import { getIdFromNodeId } from "../../../lib/hasura"
import deleteInConnection from "../../../relay/deleteInConnection"
import GoalMutate from "../../goal/GoalMutate"
import { MemoObjectType } from "../../types"
import { DropdownMenuItem } from "../../ui/menu/DropdownMenu"
import {
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../ui/primitives/Dialog"
import { SeparatorHorizontal } from "../../ui/Separator"
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
  const componentMounted = useRef(true)

  const [commitDelete] = useMutation<LeftSidebarItemMenuDeleteMutation>(
    deleteMutation
  )
  const [commitArchive] = useMutation<LeftSidebarItemMenuArchiveAllMutation>(
    archiveAllMutation
  )

  const [openDialog, setOpenDialog] = useState(false)
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { targetConnection, type, targetConnectionConfig } = props

  const { id, archived } = props.item

  useEffect(() => {
    return () => {
      componentMounted.current = false
    }
  })

  const onDelete = useCallback(() => {
    setLoading(true)

    const variables: any = {
      id: getIdFromNodeId(id),
    }

    const mutationConfig: UseMutationConfig<LeftSidebarItemMenuDeleteMutation> = {
      variables,
      onError: error => {
        if (!componentMounted.current) return

        setErrors([error])
        setLoading(false)
      },
      onCompleted: (response, errors) => {
        if (!componentMounted.current) return

        setLoading(false)
        setErrors(errors ?? [])

        if (errors && errors.length !== 0) {
          console.error("found errors " + JSON.stringify(errors))
          return
        }
      },
      updater: store => {
        deleteInConnection(store, targetConnection, targetConnectionConfig, id)
      },
    }

    commitDelete(mutationConfig)
  }, [id, targetConnection, targetConnectionConfig, setLoading, setErrors])

  const onArchive = useCallback(() => {
    setLoading(true)

    const variables = {
      id: getIdFromNodeId(id),
      archived: !archived,
    }

    const mutationConfig: UseMutationConfig<LeftSidebarItemMenuArchiveAllMutation> = {
      variables,
      onError: error => {
        if (!componentMounted.current) return

        setErrors([error])
        setLoading(false)
      },
      onCompleted: (response, errors) => {
        if (!componentMounted.current) return

        setLoading(false)
        setErrors(errors ?? [])

        if (errors && errors.length !== 0) {
          console.error("found errors " + JSON.stringify(errors))
          return
        }
      },
      optimisticUpdater: store => {
        const record = store.get(id)

        if (!record) {
          console.error(`unable to find record for item ${id}`)
          return
        }

        record.setValue(variables.archived, "archived")
      },
    }

    commitArchive(mutationConfig)
  }, [id, archived, setLoading, setErrors])


  return (
    <React.Fragment>
      <DialogRoot open={openDialog} onOpenChange={setOpenDialog}>
        <DropdownMenuItem>
          <DialogTrigger
            onClick={event => event.stopPropagation()}
            className="flex gap-2 w-full items-center">
            <Pencil1Icon color="var(--icon-color)" />
            Edit
          </DialogTrigger>
        </DropdownMenuItem>
        <DialogContent>
          <GoalMutate
            goal={props.item as any}
            onComplete={() => setOpenDialog(false)}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </DialogRoot>
      <DropdownMenuItem className="flex gap-2 items-center" onClick={onArchive}>
        <ArchiveIcon color="var(--icon-color)" />
        {props.item.archived ? "Recover" : "Archive"}
      </DropdownMenuItem>
      <DropdownMenuItem className="flex gap-2 items-center" onClick={onDelete}>
        <TrashIcon color="var(--icon-color)" />
        Delete
      </DropdownMenuItem>
    </React.Fragment>
  )
}
