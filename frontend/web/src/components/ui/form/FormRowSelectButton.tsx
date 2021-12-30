import React, { useEffect, useState } from "react"
import { FormikProps } from "formik"
import FormRowWrapper from "./FormRowWrapper"
import SelectButtonMenu, { SelectButtonItem } from "../menu/SelectButtonMenu"
import { ObjectGeneric } from "../../object"

export type ItemToggleOp = "added" | "removed"

interface Props<T> extends FormikProps<T> {
  label: string
  name: string
  innerClassName?: string
  items: SelectButtonItem<T>[]
  isMulti?: boolean
  onToggleItem?: (item: ObjectGeneric, op: ItemToggleOp) => void
}

export default function FormRowSelectButton<T>(props: Props<T>) {
  const { name, items: rawItems, setFieldValue, values, onToggleItem } = props

  const [items, setItems] = useState<Record<string, SelectButtonItem<T>>>({})

  useEffect(() => {
    const itemMap = {}
    for (let item of rawItems) {
      itemMap[item.id] = item
    }
    setItems(itemMap)
  }, [rawItems])

  const selectedItems = values[name]
    .map((id: string) => {
      if (!items.hasOwnProperty(id)) {
        return null
      }
      return items[id]
    })
    .filter((item: string) => !!item)

  function toggleItem(item: SelectButtonItem<T>) {
    const newItems = [...values[name]]
    const currentIdx = newItems.findIndex(itemId => itemId === item.id)

    let op: ItemToggleOp
    if (currentIdx !== -1) {
      newItems.splice(currentIdx, 1)
      op = "removed"
    } else {
      newItems.push(item.id)
      op = "added"
    }

    setFieldValue(name, newItems)

    if (onToggleItem) {
      onToggleItem(item, op)
    }
  }

  return (
    <FormRowWrapper {...props}>
      <SelectButtonMenu<T>
        items={rawItems}
        selectedItems={selectedItems}
        toggleItem={toggleItem}
      />
    </FormRowWrapper>
  )
}
