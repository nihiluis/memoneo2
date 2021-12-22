import React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import style from "./Dialog.module.css"
import { cx } from "../../../lib/reexports"

export function DialogRoot({
  children,
  ...props
}: DialogPrimitive.DialogProps): JSX.Element {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogOverlay />
      {children}
    </DialogPrimitive.Root>
  )
}

export function DialogOverlay(
  props: DialogPrimitive.DialogOverlayProps
): JSX.Element {
  return <DialogPrimitive.Overlay {...props} />
}

export function DialogContent({
  className,
  ...props
}: DialogPrimitive.DialogContentProps): JSX.Element {
  return (
    <DialogPrimitive.Content
      className={cx(style.content, className)}
      {...props}
    />
  )
}

export function DialogTitle(
  props: DialogPrimitive.DialogTitleProps
): JSX.Element {
  return <DialogPrimitive.Title {...props} />
}

export function DialogDescription(
  props: DialogPrimitive.DialogDescriptionProps
): JSX.Element {
  return <DialogPrimitive.Description {...props} />
}

export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
