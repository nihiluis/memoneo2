import { ArchiveIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import React, { PropsWithChildren, useCallback, useState } from "react"
import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "../ui/primitives/Dialog"
import { SeparatorHorizontal } from "../ui/Separator"
import { ListItemProps } from "./List"
import { useMutation } from "react-relay"
import { DEFAULT_GOAL_CONNECTION } from "../../constants/connections"
import { getIdFromNodeId } from "../../lib/hasura"
import deleteInConnection from "../../relay/deleteInConnection"
import { getRootConnectionIds } from "../../relay/getConnection"
import { useFilterStore } from "../../stores/filter"
import { archiveAllMutation } from "../mutation/Archive.gql"
import { deleteAllMutation, deleteGoalMutation } from "../mutation/Delete.gql"
import getMutationConfig from "../mutation/getMutationConfig"
import { ArchiveAllMutation } from "../mutation/__generated__/ArchiveAllMutation.graphql"
import { DeleteGoalMutation } from "../mutation/__generated__/DeleteGoalMutation.graphql"
import { DeleteAllMutation } from "../mutation/__generated__/DeleteAllMutation.graphql"
import { cx } from "../../lib/reexports"
import style from "./List.module.css"

interface ItemMin {
  id: string
  title: string
  archived: boolean
}

interface InnerProps {
  additionalIcons?: React.ReactNode
}

type Props<Item extends ItemMin> = ListItemProps<Item> & InnerProps

export default function ListItem<Item extends ItemMin>(
  props: Props<Item>
): JSX.Element {
  const {
    item,
    isLast,
    additionalIcons,
    setLoading,
    setErrors,
    MutateComponent,
    connection,
    onClickEdit,
  } = props
  const [commitDelete] = useMutation<DeleteAllMutation>(deleteAllMutation)
  const [commitArchive] = useMutation<ArchiveAllMutation>(archiveAllMutation)

  const filters = useFilterStore(state => state.getFilters(connection))

  const onDelete = useCallback(() => {
    setLoading(true)

    const variables: any = {
      id: getIdFromNodeId(item.id),
      connections: [...getRootConnectionIds(connection, filters)],
    }

    const mutationConfig = getMutationConfig<DeleteAllMutation>(variables, {
      setErrors,
      setLoading,
      updater: store => {
        deleteInConnection(store, connection, filters[0], item.id)
      },
    })

    commitDelete(mutationConfig)
  }, [item.id, setLoading, setErrors, filters, commitDelete, connection])

  const onArchive = useCallback(() => {
    setLoading(true)

    const variables = {
      id: getIdFromNodeId(item.id),
      archived: !item.archived,
      connections: [...getRootConnectionIds(connection, filters)],
    }

    const mutationConfig = getMutationConfig<ArchiveAllMutation>(variables, {
      setErrors,
      setLoading,
      optimisticUpdater: store => {
        const record = store.get(item.id)

        if (!record) {
          console.error(`unable to find record for item ${item.id}`)
          return
        }

        record.setValue(variables.archived, "archived")
      },
    })

    commitArchive(mutationConfig)
  }, [
    item.id,
    item.archived,
    setLoading,
    setErrors,
    commitArchive,
    connection,
    filters,
  ])

  return (
    <div
      className={cx(
        "pt-2 px-2 hover:bg-gray-50 cursor-pointer",
        style.listItem
      )}>
      <div className="flex justify-between">
        <p className="truncate">{item.title}</p>
        <div className="flex items-center">
          <DialogWrapper {...props} />
          {additionalIcons}
          <ArchiveIcon
            color="var(--icon-color)"
            width={20}
            height={20}
            className="icon-20 icon-bg-dark"
            onClick={onArchive}
          />
          <TrashIcon
            color="var(--icon-color)"
            width={20}
            height={20}
            className="icon-20 icon-bg-dark"
            onClick={onDelete}
          />
        </div>
      </div>
      {!isLast && <SeparatorHorizontal className="mt-2" />}
      {isLast && <div className="pt-2" />}
    </div>
  )
}

function DialogWrapper(
  props: PropsWithChildren<{ type: string } & Props<ItemMin>>
): JSX.Element {
  const { type, MutateComponent, item, onClickEdit } = props
  const [openDialog, setOpenDialog] = useState(false)

  function handleEdit() {
    if (!onClickEdit) {
      return
    }

    onClickEdit(item)
  }

  if (onClickEdit) {
    return (
      <Pencil1Icon
        color="var(--icon-color)"
        onClick={handleEdit}
        width={20}
        height={20}
        className="icon-20 icon-bg-dark"
      />
    )
  } else {
    return (
      <DialogRoot open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger onClick={event => event.stopPropagation()}>
          <Pencil1Icon
            color="var(--icon-color)"
            width={20}
            height={20}
            className="icon-20 icon-bg-dark"
          />
        </DialogTrigger>
        <DialogContent>
          <MutateComponent
            item={item}
            onComplete={() => setOpenDialog(false)}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </DialogRoot>
    )
  }
}
