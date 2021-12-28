import React, { ButtonHTMLAttributes, PropsWithChildren } from "react"
import { cx } from "../../../lib/reexports"

interface Props extends PropsWithChildren<ButtonHTMLAttributes<{}>> {
  className?: string
  type?: "button" | "submit" | "reset"
}

export default function Button(props: Props) {
  const { className, type = "button", children, ...rest } = props

  return (
    <button {...rest} className={cx("btn", className)} type={type}>
      {children}
    </button>
  )
}
