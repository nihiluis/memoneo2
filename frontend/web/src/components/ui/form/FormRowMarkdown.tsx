import React, { useMemo } from "react"
import { FormikProps } from "formik"
import CodeMirror from "@uiw/react-codemirror"
import { basicSetup, EditorView } from "@codemirror/basic-setup"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
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

  const extensions = useMemo(
    () => [
      basicSetup,
      markdown({ base: markdownLanguage }),
      EditorView.lineWrapping
    ],
    []
  )

  return (
    <FormRowWrapper {...props} style={style}>
      <CodeMirror
        //className={cx("p-2 rounded", innerClassName)}
        value={values[name]}
        height="auto"
        onChange={value => setFieldValue(name, value)}
        onBlur={() => setFieldTouched(name)}
        extensions={extensions}
      />
    </FormRowWrapper>
  )
}
