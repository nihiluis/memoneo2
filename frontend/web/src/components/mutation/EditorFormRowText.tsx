import { FormikProps } from "formik"
import React from "react"
import FormRowInput from "../ui/form/FormRowInput"

interface Props extends FormikProps<any> {
  type: string
  name: string
  label: string
}

export default function EditorFormRowText(props: Props): JSX.Element {
  const { type, name, label, ...formikProps } = props

  return (
    <FormRowInput
      innerClassName="bg-gray-50 border border-gray-200"
      {...formikProps}
      type={type}
      name={name}
      label={label}
    />
  )
}
