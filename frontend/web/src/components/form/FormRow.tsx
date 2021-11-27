import React from "react"
import { FormikProps } from "formik"

interface Props<T> extends FormikProps<T> {
  label: string
  type: string
  name: string
}

export default function FormRow<T>(props: Props<T>) {
  const {
    label,
    type,
    name,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
  } = props

  return (
    <div className="form-row">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name]}
      />
      {errors[name] && touched[name] && errors[name]}
    </div>
  )
}
