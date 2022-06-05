import React from "react"
import { FormikProps } from "formik"
import { cx } from "../../../lib/reexports"

interface Props extends FormikProps<{}> {
  type: string
  name: string
  className?: string
  autoFocus?: boolean
  applyDefaultClass?: boolean
}

export default function FormInput(props: Props) {
  const {
    type,
    name,
    handleChange,
    handleBlur,
    values,
    className,
    autoFocus = false,
    applyDefaultClass = true,
  } = props

  return (
    <input
      className={cx(
        { "form-input": applyDefaultClass },
        "outline-none",
        className
      )}
      type={type}
      name={name}
      autoFocus={autoFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values[name]}
    />
  )
}
