import { FormikProps } from "formik"
import React from "react"
import FormRowSelectButton, { Item } from "../ui/form/FormRowSelectButton"

interface Props extends FormikProps<any> {
  name: string
  label: string
  items: Item[]
}

export default function EditorFormRowSelectButton(props: Props): JSX.Element {
  const { name, label, items, ...formikProps } = props

  return (
    <FormRowSelectButton
      innerClassName="bg-gray-50 border border-gray-200"
      {...formikProps}
      name={name}
      label={label}
      items={items}
    />
  )
}
