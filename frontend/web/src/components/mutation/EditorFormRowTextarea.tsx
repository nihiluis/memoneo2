import { FormikProps } from "formik"
import React from "react"
import FormRowTextarea from "../ui/form/FormRowTextarea"

interface Props extends FormikProps<any> {
  name: string
  label: string
}

export default function EditorFormRowTextarea(props: Props): JSX.Element {
  const { name, label, ...formikProps } = props

  return (
    <FormRowTextarea
      innerClassName="bg-gray-50 border border-gray-200"
      {...formikProps}
      name={name}
      label={label}
    />
  )
}
