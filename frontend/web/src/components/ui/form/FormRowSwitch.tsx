import React from "react"
import { FormikProps } from "formik"
import { Switch } from "../primitives/Switch"

interface Props<T> extends FormikProps<T> {
  label: string
  name: string
  innerClassName?: string
}

export default function FormRowSwitch<T>(props: Props<T>) {
  const {
    label,
    name,
    setFieldValue,
    values,
    innerClassName = "",
  } = props

  return (
    <div className="form-row">
      <label className="form-label">{label}</label>
      <Switch checked={values[name]} onCheckedChange={() => setFieldValue(name, !values[name])} />
    </div>
  )
}
