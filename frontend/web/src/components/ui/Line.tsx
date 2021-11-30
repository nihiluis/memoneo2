import React from "react"
import { cx } from "../../lib/reexports"

interface Props {
  height?: number
  className?: string
}

export default function Line({
  height = 1,
  className = "",
}: Props): JSX.Element {
  return (
    <div
      className={cx("bg-gray-300", className)}
      style={{ height }}></div>
  )
}
