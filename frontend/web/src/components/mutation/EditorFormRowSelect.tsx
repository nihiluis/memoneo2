import { FormikProps } from "formik"
import React from "react"
import { Options } from "react-select"
import FormRowSelect, { Option } from "../ui/form/FormRowSelect"

interface Props extends FormikProps<any> {
  name: string
  label: string
  options: Options<Option>
}

export default function EditorFormRowSelect(props: Props): JSX.Element {
  const { name, label, options, ...formikProps } = props

  return (
    <FormRowSelect
      innerClassName="bg-gray-50 border border-gray-200"
      {...formikProps}
      name={name}
      label={label}
      options={options}
    />
  )
}
