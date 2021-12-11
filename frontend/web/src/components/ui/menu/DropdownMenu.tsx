import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { PropsWithChildren } from "react"
import { cx } from "../../../lib/reexports"

import dropdownStyle from "./Dropdown.module.css"

export const DropdownMenuRoot = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export function DropdownMenuTriggerButton(
  props: PropsWithChildren<any>
): JSX.Element {
  return (
    <DropdownMenuTrigger
      className={cx(dropdownStyle.trigger, "btn-default", props.className)}>
      {props.children}
    </DropdownMenuTrigger>
  )
}

export function DropdownMenuContent(
  props: PropsWithChildren<any>
): JSX.Element {
  return (
    <DropdownMenuPrimitive.Content
      className={cx(dropdownStyle.content, props.className)}>
      {props.children}
    </DropdownMenuPrimitive.Content>
  )
}

interface ItemProps {
  className?: string
  interactive?: boolean
  onClick?: () => void
}

export function DropdownMenuItem(
  props: PropsWithChildren<ItemProps>
): JSX.Element {
  return props.onClick ? (
    <DropdownMenuPrimitive.Item
      className={cx(
        dropdownStyle.item,
        { [dropdownStyle.itemInteractive]: props.interactive ?? true },
        props.className
      )}
      onClick={props.onClick}>
      {props.children}
    </DropdownMenuPrimitive.Item>
  ) : (
    <DropdownMenuPrimitive.Item
      className={cx(
        dropdownStyle.item,
        { [dropdownStyle.itemInteractive]: props.interactive ?? true },
        props.className
      )}>
      {props.children}
    </DropdownMenuPrimitive.Item>
  )
}

export function DropdownMenuLabel(props: PropsWithChildren<any>): JSX.Element {
  return (
    <DropdownMenuPrimitive.Label
      className={cx(dropdownStyle.label, props.className)}>
      {props.children}
    </DropdownMenuPrimitive.Label>
  )
}
