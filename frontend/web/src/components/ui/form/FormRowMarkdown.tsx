import React from "react"
import { FormikProps } from "formik"
import { Controlled as CodeMirror } from "react-codemirror2"
if (typeof window !== "undefined") {
  require("codemirror/mode/markdown/markdown")
}
import { cx } from "../../../lib/reexports"

interface Props<T> extends FormikProps<T> {
  label: string
  name: string
  innerClassName?: string
}

export default function FormRowMarkdown<T>(props: Props<T>) {
  const {
    label,
    name,
    setFieldValue,
    setFieldTouched,
    values,
    errors,
    touched,
    innerClassName = "",
  } = props

  return (
    <div className="form-row">
      <label className="form-label">{label}</label>
      <CodeMirror
        className={cx("p-2 rounded w-full", innerClassName)}
        value={values[name]}
        options={{
          mode: "markdown",
        }}
        onBeforeChange={(editor, data, value) => setFieldValue(name, value)}
        onBlur={() => setFieldTouched(name, true)}
      />
      {errors[name] && touched[name] && (
        <p className="text-error">{errors[name]}</p>
      )}
    </div>
  )
}
