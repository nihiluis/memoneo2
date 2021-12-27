import React from "react"
import { FormikProps } from "formik"
import { cx } from "../../../lib/reexports"
import FormRowWrapper from "./FormRowWrapper"

interface Props<T> extends FormikProps<T> {
  label: string
  type: string
  name: string
  innerClassName?: string
  style?: React.CSSProperties
}

export default function FormRowInput<T>(props: Props<T>) {
  const {
    label,
    type,
    name,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    style,
    innerClassName = "",
  } = props

  return (
    <FormRowWrapper {...props}>
      <input
        className={cx("form-input", innerClassName)}
        type={type}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name]}
      />
    </FormRowWrapper>
  )
}
