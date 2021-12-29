import React from "react"
import { cx } from "../../../lib/reexports"
import Button from "../primitives/Button"

export interface SelectButtonItem<T> {
  value: T
  id: string
  label: string
}

interface Props<T> {
  items: SelectButtonItem<T>[]
  selectedItems: SelectButtonItem<T>[]
  toggleItem(item: SelectButtonItem<T>): void
}

export default function SelectButtonMenu<T>(props: Props<T>): JSX.Element {
  const { items, selectedItems, toggleItem } = props

  const selectedItemIdMap: Record<string, SelectButtonItem<T>> = {}
  for (let item of selectedItems) {
    selectedItemIdMap[item.id] = item
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {items.map(item => (
        <SelectButtonItem
          key={`SelectButtonItem-${item.id}`}
          item={item}
          toggleItem={toggleItem}
          active={selectedItemIdMap.hasOwnProperty(item.id)}
        />
      ))}
    </div>
  )
}

interface ItemProps<T> {
  item: SelectButtonItem<T>
  active: boolean
  toggleItem(item: SelectButtonItem<T>): void
}

function SelectButtonItem<T>(props: ItemProps<T>): JSX.Element {
  const { item, active, toggleItem } = props

  return (
    <Button
      style={{ maxWidth: 120 }}
      className={cx(
        "btn btn-secondary rounded-full text-xs max-w-xs truncate",
        {
          "bg-gray-500": !active,
          "bg-gray-800": active,
        }
      )}
      onClick={() => toggleItem(item)}>
      {item.label}
    </Button>
  )
}
