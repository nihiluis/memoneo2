import { FormikProps } from "formik"
import React from "react"
import { cx } from "../../lib/reexports"
import FormRowInput from "../ui/form/FormRowInput"

interface Props extends FormikProps<any> {
  type: string
  name: string
  label: string
  className?: string
  innerClassName?: string
  style?: React.CSSProperties
}

export default function EditorFormRowText(props: Props): JSX.Element {
  const {
    type,
    name,
    label,
    className,
    innerClassName,
    style,
    ...formikProps
  } = props

  return (
    <FormRowInput
      style={style}
      className={className}
      innerClassName={cx("bg-gray-50 border border-gray-200", innerClassName)}
      {...formikProps}
      type={type}
      name={name}
      label={label}
    />
  )
}
