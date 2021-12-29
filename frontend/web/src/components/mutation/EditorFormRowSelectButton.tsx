import { FormikProps } from "formik"
import React from "react"
import { ObjectGeneric } from "../object"
import FormRowSelectButton from "../ui/form/FormRowSelectButton"
import { SelectButtonItem } from "../ui/menu/SelectButtonMenu"

interface Props extends FormikProps<any> {
  name: string
  label: string
  items: SelectButtonItem<ObjectGeneric>[]
  onToggleItem?: (item: ObjectGeneric) => void
}

export default function EditorFormRowSelectButton(props: Props): JSX.Element {
  const { name, label, items, onToggleItem, ...formikProps } = props

  return (
    <FormRowSelectButton
      innerClassName="bg-gray-50 border border-gray-200"
      {...formikProps}
      name={name}
      label={label}
      items={items}
      onToggleItem={onToggleItem}
    />
  )
}
