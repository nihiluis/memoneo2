import { FormikProps } from "formik"
import React, { PropsWithChildren } from "react"

interface Props extends PropsWithChildren<FormikProps<any>> {
  label: string
  style?: React.CSSProperties
}

export default function FormRowWrapper(props: Props): JSX.Element {
  const { label, errors, touched, children, style } = props

  return (
    <div className="form-row" style={style}>
      <label className="form-label">{label}</label>
      {children}
      {errors[name] && touched[name] && (
        <p className="text-error">{errors[name]}</p>
      )}
    </div>
  )
}
