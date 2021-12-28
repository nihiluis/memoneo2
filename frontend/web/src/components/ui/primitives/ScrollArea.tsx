import { ScrollAreaProps } from "@radix-ui/react-scroll-area"
import React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cx } from "../../../lib/reexports"
import style from "./ScrollArea.module.css"

export function ScrollAreaRoot({
  className,
  children,
  ...props
}: ScrollAreaProps): JSX.Element {
  return (
    <ScrollAreaPrimitive.Root className={cx(style.root, className)} {...props}>
      {children}
    </ScrollAreaPrimitive.Root>
  )
}

export function ScrollAreaViewport({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.ScrollAreaViewportProps): JSX.Element {
  return (
    <ScrollAreaPrimitive.Viewport
      className={cx(style.viewport, className)}
      {...props}>
      {children}
    </ScrollAreaPrimitive.Viewport>
  )
}

export function ScrollAreaScrollbar({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.ScrollAreaScrollbarProps): JSX.Element {
  return (
    <ScrollAreaPrimitive.Scrollbar
      className={cx(style.scrollbar, className)}
      {...props}>
      {children}
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export function ScrollAreaThumb({
  className,
  ...props
}: ScrollAreaPrimitive.ScrollAreaThumbProps): JSX.Element {
  return (
    <ScrollAreaPrimitive.Thumb
      className={cx(style.thumb, className)}
      {...props}
    />
  )
}

export function ScrollAreaCorner({
  className,
  ...props
}: ScrollAreaPrimitive.ScrollAreaCornerProps): JSX.Element {
  return (
    <ScrollAreaPrimitive.Corner
      className={cx(style.corner, className)}
      {...props}
    />
  )
}
