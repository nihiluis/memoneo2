import React, { PropsWithChildren } from "react"

export default function FormRowFlexWrapper(
  props: PropsWithChildren<{}>
): JSX.Element {
  return <div className="flex gap-2">{props.children}</div>
}
