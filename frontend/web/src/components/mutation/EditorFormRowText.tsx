import { FormikProps } from "formik"
import React from "react"
import { cx } from "../../lib/reexports"
import FormRowInput from "../ui/form/FormRowInput"

interface Props extends FormikProps<any> {
  type: string
  name: string
  label: string
  innerClassName?: string
  style?: React.CSSProperties
}

export default function EditorFormRowText(props: Props): JSX.Element {
  const {
    type,
    name,
    label,
    innerClassName: className,
    style,
    ...formikProps
  } = props

  return (
    <FormRowInput
      style={style}
      innerClassName={cx("bg-gray-50 border border-gray-200", className)}
      {...formikProps}
      type={type}
      name={name}
      label={label}
    />
  )
}
