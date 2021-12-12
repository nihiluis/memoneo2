import { FormikProps } from "formik"
import React from "react"
import FormRowSwitch from "../ui/form/FormRowSwitch"

interface Props extends FormikProps<any> {
  name: string
  label: string
}

export default function EditorSwitch(props: Props): JSX.Element {
  const { name, label, ...formikProps } = props

  return (
    <FormRowSwitch
      {...formikProps}
      name={name}
      label={label}
    />
  )
}
