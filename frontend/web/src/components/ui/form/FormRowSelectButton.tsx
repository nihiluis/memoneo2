import React, { useEffect, useState } from "react"
import { FormikProps } from "formik"
import { cx } from "../../../lib/reexports"
import FormRowWrapper from "./FormRowWrapper"
import Select, { GroupBase, Options, OptionsOrGroups } from "react-select"
import SelectButtonMenu from "../menu/SelectButtonMenu"

export interface Item {
  label: string
  value: string
}

interface Props<T> extends FormikProps<T> {
  label: string
  name: string
  innerClassName?: string
  items: Item[]
  isMulti?: boolean
}

export default function FormRowSelectButton<T>(props: Props<T>) {
  const {
    name,
    isMulti,
    items: rawItems,
    setFieldValue,
    handleBlur,
    values,
    innerClassName = "",
  } = props

  const [items, setItems] = useState<Record<string, Item>>({})

  useEffect(() => {
    const itemMap = {}
    for (let opt of rawItems) {
      itemMap[opt.value] = opt
    }
    setItems(itemMap)
  }, [rawItems])

  const selectedItems = values[name].map((value: string) => items[value])

  function toggleItem(item: Item) {
    const newItems = [...values[name]]
    const currentIdx = newItems.findIndex(itemValue => itemValue === item.value)

    if (currentIdx !== -1) {
      newItems.splice(currentIdx, 1)
    } else {
      newItems.push(item.value)
    }

    setFieldValue(name, newItems)
  }

  return (
    <FormRowWrapper {...props}>
      <SelectButtonMenu
        items={rawItems}
        selectedItems={selectedItems}
        toggleItem={toggleItem}
      />
    </FormRowWrapper>
  )
}

const styleProxy = new Proxy(
  {},
  {
    get: (target, propKey) => () => {},
  }
)
