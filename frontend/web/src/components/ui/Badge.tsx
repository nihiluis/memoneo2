import React from "react"
import { cx } from "../../lib/reexports"

interface Props {
  title: string
  color?: string
  className?: string
  outline?: boolean
  style?: { borderColor?: string }
  onClick?: () => void
}

export default function Badge(props: Props): JSX.Element {
  const style: any = { ...props.style } || {}

  if (props.color && !props.outline) {
    style.backgroundColor = props.color
  }
  if (props.color) {
    style.borderColor = props.color
  }

  return (
    <div
      className={cx(
        "rounded-full px-2 py-1 text-sm border-2",
        {
          "bg-gray-600 text-white border-white border-opacity-0": !props.outline,
        },
        { "text-standard": props.outline },
        props.className
      )}
      onClick={props.onClick}
      style={style}>
      {props.title}
    </div>
  )
}
