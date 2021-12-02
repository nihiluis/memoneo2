import { PropsWithChildren } from "react"

import React from "react"
import css from "./IconButton.module.css"
import { cx } from "../../../lib/reexports"
import { PrimitiveButtonProps } from "@radix-ui/react-dropdown-menu"

export default function IconButton(
  props: PropsWithChildren<PrimitiveButtonProps>
): JSX.Element {
  return (
    <button className={cx("btn-default", css.iconButton)}>
      {props.children}
    </button>
  )
}
