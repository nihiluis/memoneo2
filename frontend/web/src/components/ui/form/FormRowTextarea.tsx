import React from "react"
import { FormikProps } from "formik"
import { cx } from "../../../lib/reexports"

interface Props<T> extends FormikProps<T> {
  label: string
  name: string
  innerClassName?: string
}

export default function FormRowTextarea<T>(props: Props<T>) {
  const {
    label,
    name,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    innerClassName = "",
  } = props

  return (
    <div className="form-row">
      <label className="form-label">{label}</label>
      <textarea
        className={cx("form-textarea", innerClassName)}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name]}
      />
      {errors[name] && touched[name] && (
        <p className="text-error">{errors[name]}</p>
      )}
    </div>
  )
}
