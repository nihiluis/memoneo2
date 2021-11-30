import React from "react"
import { cx } from "../../lib/reexports"

interface Props {
  title: string
  color?: string
  className?: string
}

export default function MiniBadge(props: Props): JSX.Element {
  const style: any = { width: 24, height: 24, lineHeight: "16px" }

  if (props.color) {
    style.backgroundColor = props.color
  }

  return (
    <div
      className={cx(
        "rounded-full p-1 bg-gray-600 text-white text-sm items-center text-center",
        props.className
      )}
      style={style}>
      {props.title[0]}
    </div>
  )
}
