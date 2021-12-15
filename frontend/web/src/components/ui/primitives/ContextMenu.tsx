import React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"

import style from "./ContextMenu.module.css"
import { cx } from "../../../lib/reexports"

export const ContextMenu = ContextMenuPrimitive.Root
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger

export function ContextMenuItem({
  className,
  ...props
}: ContextMenuPrimitive.ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      className={cx(
        style.item,
        { [style.itemInteractive]: !!props.onClick },
        className
      )}
      {...props}
    />
  )
}

export function ContextMenuContent({
  className,
  ...props
}: ContextMenuPrimitive.ContextMenuContentProps) {
  return (
    <ContextMenuPrimitive.Content
      className={cx(style.content, className)}
      {...props}
    />
  )
}
