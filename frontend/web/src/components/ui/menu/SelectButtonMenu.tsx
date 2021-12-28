import React from "react"
import { cx } from "../../../lib/reexports"
import Button from "../primitives/Button"

export interface Item {
  value: string
  label: string
}

interface Props {
  items: Item[]
  selectedItems: Item[]
  toggleItem(item: Item): void
}

export default function SelectButtonMenu(props: Props): JSX.Element {
  const { items, selectedItems, toggleItem } = props

  const selectedItemIdMap: Record<string, Item> = {}
  for (let item of selectedItems) {
    selectedItemIdMap[item.value] = item
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {items.map(item => (
        <SelectButtonItem
          key={`SelectButtonItem-${item.value}`}
          item={item}
          toggleItem={toggleItem}
          active={selectedItemIdMap.hasOwnProperty(item.value)}
        />
      ))}
    </div>
  )
}

interface ItemProps {
  item: Item
  active: boolean
  toggleItem(item: Item): void
}

function SelectButtonItem(props: ItemProps): JSX.Element {
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
