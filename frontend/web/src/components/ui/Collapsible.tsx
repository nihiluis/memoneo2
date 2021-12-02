import React from "react"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

interface RootProps extends CollapsiblePrimitive.CollapsibleProps {

}

interface TriggerProps extends CollapsiblePrimitive.CollapsibleTriggerProps {}
interface ContentProps extends CollapsiblePrimitive.CollapsibleContentProps {}

export function Collapsible(props: RootProps): JSX.Element {
  return <CollapsiblePrimitive.Collapsible {...props}>{props.children}</CollapsiblePrimitive.Collapsible>
}

export function CollapsibleTrigger(props: TriggerProps): JSX.Element {
  return <CollapsiblePrimitive.Trigger {...props}>{props.children}</CollapsiblePrimitive.Trigger>
}

export function CollapsibleContent(props: ContentProps): JSX.Element {
  return <CollapsiblePrimitive.Content {...props}>{props.children}</CollapsiblePrimitive.Content>
}
