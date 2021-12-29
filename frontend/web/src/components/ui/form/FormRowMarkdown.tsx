import React from "react"
import { FormikProps } from "formik"
import { Controlled as CodeMirror } from "react-codemirror2"
if (typeof window !== "undefined") {
  require("codemirror/mode/markdown/markdown")
}
import { cx } from "../../../lib/reexports"
import FormRowWrapper from "./FormRowWrapper"

interface Props<T> extends FormikProps<T> {
  label: string
  name: string
  innerClassName?: string
  style?: React.CSSProperties
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
    style,
  } = props

  return (
    <FormRowWrapper {...props} style={style}>
      <CodeMirror
        className={cx("p-2 rounded w-full", innerClassName)}
        value={values[name]}
        options={{
          mode: "markdown",
        }}
        onBeforeChange={(editor, data, value) => setFieldValue(name, value)}
        onBlur={() => setFieldTouched(name, true)}
      />
    </FormRowWrapper>
  )
}
