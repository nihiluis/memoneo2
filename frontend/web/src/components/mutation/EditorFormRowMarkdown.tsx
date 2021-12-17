import { FormikProps } from "formik"
import React from "react"
import FormRowInput from "../ui/form/FormRowInput"
import FormRowMarkdown from "../ui/form/FormRowMarkdown"

interface Props extends FormikProps<any> {
  name: string
  label: string
}

export default function EditorFormRowMarkdown(props: Props): JSX.Element {
  const { name, label, ...formikProps } = props

  return (
    <FormRowMarkdown
      innerClassName="bg-gray-50 border border-gray-200"
      {...formikProps}
      name={name}
      label={label}
    />
  )
}
