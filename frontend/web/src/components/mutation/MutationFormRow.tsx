import { FormikProps } from "formik"
import React from "react"
import FormRow from "../ui/form/FormRow"

interface Props extends FormikProps<any> {
  type: string
  name: string
  label: string
}

export default function MutationFormRow(props: Props): JSX.Element {
  const { type, name, label, ...formikProps } = props

  return (
    <FormRow
      inputClassName="bg-gray-50 border border-gray-200"
      {...formikProps}
      type={type}
      name={name}
      label={label}
    />
  )
}
