import { ArchiveIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import React, { Suspense, useCallback, useEffect, useRef } from "react"
import { useMutation } from "react-relay"
import { PayloadError } from "relay-runtime"
import { DEFAULT_GOAL_CONNECTION } from "../../../constants/connections"
import { getIdFromNodeId } from "../../../lib/hasura"
import deleteInConnection from "../../../relay/deleteInConnection"
import { getRootConnectionIds } from "../../../relay/getConnection"
import { useFilterStore } from "../../../stores/filter"
import getMutationConfig from "../../mutation/getMutationConfig"
import TodoMutate from "../../object/todo/TodoMutate"
import { MemoObjectType } from "../../types"
import { DropdownMenuItem } from "../../ui/menu/DropdownMenu"
import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "../../ui/primitives/Dialog"
import {
  archiveAllMutation,
  deleteTodoMutation,
} from "./LeftSidebarItemMenu.gql"
import { LeftSidebarItemMenuArchiveAllMutation } from "./__generated__/LeftSidebarItemMenuArchiveAllMutation.graphql"
import { LeftSidebarItemMenuDeleteTodoMutation } from "./__generated__/LeftSidebarItemMenuDeleteTodoMutation.graphql"

interface Props {
  item: { id: string; archived: boolean }
  type: MemoObjectType
  loading: boolean
  setLoading: (loading: boolean) => void
  errors: PayloadError[]
  setErrors: (errors: PayloadError[]) => void
  openDialog: boolean
  setOpenDialog: (open: boolean) => void
}

export default function LeftSidebarItemMenuTodo(props: Props) {
  return (
    <Suspense fallback={null}>
      <LeftSidebarItemMenuTodoInner {...props} />
    </Suspense>
  )
}

function LeftSidebarItemMenuTodoInner(props: Props): JSX.Element {
  const componentMounted = useRef(true)
  useEffect(() => {
    return () => {
      componentMounted.current = false
    }
  })

  const { item, setLoading, setErrors, openDialog, setOpenDialog } = props

  const [commitDelete] = useMutation<LeftSidebarItemMenuDeleteTodoMutation>(
    deleteTodoMutation
  )
  const [commitArchive] = useMutation<LeftSidebarItemMenuArchiveAllMutation>(
    archiveAllMutation
  )

  const defaultTodoFilters = useFilterStore(state =>
    state.getFilters(DEFAULT_GOAL_CONNECTION)
  )

  const onDelete = useCallback(() => {
    setLoading(true)

    const variables: any = {
      id: getIdFromNodeId(item.id),
      connections: [
        ...getRootConnectionIds(DEFAULT_GOAL_CONNECTION, defaultTodoFilters),
      ],
    }

    const mutationConfig = getMutationConfig<LeftSidebarItemMenuDeleteTodoMutation>(
      variables,
      {
        setErrors: value => {
          if (!componentMounted.current) return

          setErrors(value)
        },
        setLoading: value => {
          if (!componentMounted.current) return

          setLoading(value)
        },
        updater: store => {
          deleteInConnection(
            store,
            DEFAULT_GOAL_CONNECTION,
            defaultTodoFilters[0],
            item.id
          )
        },
      }
    )

    commitDelete(mutationConfig)
  }, [item.id, setLoading, setErrors, defaultTodoFilters, commitDelete])

  const onArchive = useCallback(() => {
    setLoading(true)

    const variables = {
      id: getIdFromNodeId(item.id),
      archived: !item.archived,
      connections: [
        ...getRootConnectionIds(DEFAULT_GOAL_CONNECTION, defaultTodoFilters),
      ],
    }

    const mutationConfig = getMutationConfig<LeftSidebarItemMenuArchiveAllMutation>(
      variables,
      {
        setErrors: value => {
          if (!componentMounted.current) return

          setErrors(value)
        },
        setLoading: value => {
          if (!componentMounted.current) return

          setLoading(value)
        },
        optimisticUpdater: store => {
          const record = store.get(item.id)

          if (!record) {
            console.error(`unable to find record for item ${item.id}`)
            return
          }

          record.setValue(variables.archived, "archived")
        },
      }
    )

    commitArchive(mutationConfig)
  }, [
    item.id,
    item.archived,
    setLoading,
    setErrors,
    defaultTodoFilters,
    commitArchive,
  ])

  return (
    <div>
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
          <TodoMutate
            item={item as any}
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
    </div>
  )
}
