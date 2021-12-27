import React from "react"
import { FormikProps } from "formik"
import { cx } from "../../../lib/reexports"
import FormRowWrapper from "./FormRowWrapper"

interface Props<T> extends FormikProps<T> {
  label: string
  name: string
  innerClassName?: string
}

export default function FormRowTextarea<T>(props: Props<T>) {
  const {
    name,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    innerClassName = "",
  } = props

  return (
    <FormRowWrapper {...props}>
      <textarea
        className={cx("form-textarea", innerClassName)}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name]}
      />
    </FormRowWrapper>
  )
}
