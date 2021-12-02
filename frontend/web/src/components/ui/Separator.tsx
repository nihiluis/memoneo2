import React from "react"
import { cx } from "../../lib/reexports"

import * as SeparatorPrimitive from "@radix-ui/react-separator"

interface Props extends SeparatorPrimitive.SeparatorProps {
  height?: number
  className?: string
}

export function SeparatorHorizontal(props: Props): JSX.Element {
  return (
    <SeparatorPrimitive.Root
      className={cx("h-px bg-gray-100 px-12", props.className)}
    />
  )
}
