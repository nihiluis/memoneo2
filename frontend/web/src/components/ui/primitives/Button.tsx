import React, { PropsWithChildren } from "react"
import { cx } from "../../../lib/reexports"

interface Props extends PropsWithChildren<{}> {
  className?: string
  type?: "button" | "submit" | "reset"
}

export default function Button(props: Props) {
  const { className, type = "button", children } = props

  return (
    <button className={cx("btn", className)} type={type}>
      {children}
    </button>
  )
}
