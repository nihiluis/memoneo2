import {
  ArchiveIcon,
  DrawingPinFilledIcon,
  DrawingPinIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons"
import React, { useCallback } from "react"
import { useMutation } from "react-relay"
import { DEFAULT_NOTE_CONNECTION } from "../../../constants/connections"
import { getIdFromNodeId } from "../../../lib/hasura"
import { getRootConnectionIds } from "../../../relay/getConnection"
import { useFilterStore } from "../../../stores/filter"
import { ListItemProps } from "../../list/List"
import ListItem from "../../list/ListItem"
import getMutationConfig from "../../mutation/getMutationConfig"
import { pinNoteMutation } from "./Pin.gql"
import { PinNoteMutation } from "./__generated__/PinNoteMutation.graphql"

interface Item {
  id: string
  title: string
  archived: boolean
  pinned: boolean
  body?: string
  date: string
}

type Props = ListItemProps<Item>

export default function NoteListItem(props: Props): JSX.Element {
  return (
    <ListItem<Item>
      {...props}
      additionalIcons={<AdditionalIcons {...props} />}
    />
  )
}

function AdditionalIcons(props: Props): JSX.Element {
  const { item, connection, setLoading, setErrors } = props

  const [commitPin] = useMutation<PinNoteMutation>(pinNoteMutation)

  const filters = useFilterStore(state => state.getFilters(connection))

  const onPin = useCallback(() => {
    setLoading(true)

    const variables = {
      id: getIdFromNodeId(item.id),
      pinned: !item.pinned,
      connections: [...getRootConnectionIds(connection, filters)],
    }

    const mutationConfig = getMutationConfig<PinNoteMutation>(variables, {
      setErrors,
      setLoading,
      optimisticUpdater: store => {
        const record = store.get(item.id)

        if (!record) {
          console.error(`unable to find record for item ${item.id}`)
          return
        }

        record.setValue(variables.pinned, "pinned")
      },
    })

    commitPin(mutationConfig)
  }, [item.id, item.archived, setLoading, setErrors, commitPin])

  return (
    <React.Fragment>
      {!item.pinned && (
        <DrawingPinIcon
          color="var(--icon-color)"
          width={20}
          height={20}
          className="icon-20 icon-bg-dark"
          onClick={onPin}
        />
      )}
      {item.pinned && (
        <DrawingPinFilledIcon
          color="var(--icon-color)"
          width={20}
          height={20}
          className="icon-20 icon-bg-dark"
          onClick={onPin}
        />
      )}
    </React.Fragment>
  )
}
