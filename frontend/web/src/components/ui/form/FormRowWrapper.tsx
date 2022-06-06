import { FormikProps } from "formik"
import React, { PropsWithChildren } from "react"
import { cx } from "../../../lib/reexports"

interface Props extends PropsWithChildren<FormikProps<any>> {
  label: string
  name: string
  style?: React.CSSProperties
  className?: string
}

export default function FormRowWrapper(props: Props): JSX.Element {
  const { label, errors, touched, children, style, className, name } = props

  return (
    <div className={cx("form-row", className)} style={style}>
      <label className="form-label">{label}</label>
      {children}
      {errors[name] && touched[name] && (
        <p className="text-error">{errors[name]}</p>
      )}
    </div>
  )
}
