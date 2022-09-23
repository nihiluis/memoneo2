import React from "react"
import { FormikProps } from "formik"
import { cx } from "../../../lib/reexports"
import FormRowWrapper from "./FormRowWrapper"
import Input from "../primitives/Input"

interface Props<T> extends FormikProps<T> {
  label: string
  type: string
  name: string
  className?: string
  innerClassName?: string
  style?: React.CSSProperties
}

export default function FormRowInput<T>(props: Props<T>) {

  return (
    <FormRowWrapper {...props} >
      <Input {...props} />
    </FormRowWrapper>
  )
}
