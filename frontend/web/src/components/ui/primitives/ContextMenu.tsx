import React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"

import style from "./ContextMenu.module.css"
import { cx } from "../../../lib/reexports"

export const ContextMenu = ContextMenuPrimitive.Root
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger

interface OwnItemProps {
  interactive?: boolean
}

export function ContextMenuItem({
  className,
  interactive,
  ...props
}: ContextMenuPrimitive.ContextMenuItemProps & OwnItemProps) {
  return (
    <ContextMenuPrimitive.Item
      className={cx(
        style.item,
        { [style.itemInteractive]: !!props.onClick || interactive },
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
