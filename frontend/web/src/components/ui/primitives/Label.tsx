import React, { PropsWithChildren } from "react"

import * as LabelPrimitive from "@radix-ui/react-label"

interface Props extends PropsWithChildren<LabelPrimitive.LabelProps> {
}

export default function Label(props: Props): JSX.Element {
  return <LabelPrimitive.Root>{props.children}</LabelPrimitive.Root>
}
