import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { PropsWithChildren } from "react"
import { cx } from "../../../lib/reexports"

import dropdownStyle from "./Dropdown.module.css"

export const DropdownMenuRoot = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export function DropdownMenuTriggerButton(props: PropsWithChildren<any>): JSX.Element {
  return (<DropdownMenuTrigger className={cx(dropdownStyle.trigger, "btn-default")}>{props.children}</DropdownMenuTrigger>)
}

export function DropdownMenuContent(
  props: PropsWithChildren<any>
): JSX.Element {
  return (
    <DropdownMenuPrimitive.Content className={dropdownStyle.content}>
      {props.children}
    </DropdownMenuPrimitive.Content>
  )
}

export function DropdownMenuItem(props: PropsWithChildren<any>): JSX.Element {
  return (
    <DropdownMenuPrimitive.Item className={dropdownStyle.item}>{props.children}</DropdownMenuPrimitive.Item>
  )
}

export function DropdownMenuLabel(props: PropsWithChildren<any>): JSX.Element {
  return (
    <DropdownMenuPrimitive.Label className={dropdownStyle.label}>{props.children}</DropdownMenuPrimitive.Label>
  )
}
