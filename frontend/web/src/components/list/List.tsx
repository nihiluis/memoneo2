import React, { useEffect, useState } from "react"
import { PayloadError } from "relay-runtime"

interface ItemMin {
  id: string
  archived: boolean
}

export type ListItemComponent<Item extends ItemMin> = (
  props: ListItemProps<Item>
) => JSX.Element

export interface ListItemProps<Item extends ItemMin> {
  item: Item
  type: string
  isLast: boolean
  loading: boolean
  setLoading: (loading: boolean) => void
  errors: PayloadError[]
  setErrors: (errors: PayloadError[]) => void
  connection: string
  MutateComponent: ListMutateComponent<Item>
}

export type ListMutateComponent<Item extends ItemMin> = (props: {
  item: Item
  onComplete: () => void
  onCancel: () => void
}) => JSX.Element

interface Props<Item extends ItemMin> {
  items: Item[]
  type: string
  showArchived: boolean
  connection: string
  ItemComponent?: ListItemComponent<Item>
  MutateComponent: ListMutateComponent<Item>
}

export default function List<Item extends ItemMin>(
  props: Props<Item>
): JSX.Element {
  const {
    items,
    type,
    showArchived,
    connection,
    ItemComponent,
    MutateComponent,
  } = props
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<PayloadError[]>([])

  const [filteredItems, setFilteredItems] = useState<Item[]>([])

  useEffect(
    () =>
      setFilteredItems(
        items.filter(item => {
          if (!showArchived && item.archived) return false

          return true
        })
      ),
    [items, showArchived]
  )

  return (
    <div>
      {filteredItems.map((item, idx) => (
        <ItemComponent
          key={`item-${item.id}`}
          type={type}
          item={item}
          isLast={idx === filteredItems.length - 1}
          loading={loading}
          setLoading={setLoading}
          errors={errors}
          setErrors={setErrors}
          MutateComponent={MutateComponent}
          connection={connection}
        />
      ))}
    </div>
  )
}
