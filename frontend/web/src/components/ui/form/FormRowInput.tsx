import React from "react"
import { FormikProps } from "formik"
import { cx } from "../../../lib/reexports"

interface Props<T> extends FormikProps<T> {
  label: string
  type: string
  name: string
  innerClassName?: string
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
    innerClassName = "",
  } = props

  return (
    <div className="form-row">
      <label className="form-label">{label}</label>
      <input
        className={cx("form-input", innerClassName)}
        type={type}
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
