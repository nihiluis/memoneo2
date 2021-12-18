import React from "react"
import { Dayjs } from "dayjs"
import { DayType } from "../../../../lib/month"
import Label from "../Label"
import { cx } from "../../../../lib/reexports"

import style from "./Calendar.module.css"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../ContextMenu"
import { ContextMenuItemComponent } from "./Calendar"

interface Props<ContextProps> {
  day: DayType
  month: Dayjs
  isFocused: boolean
  isActive: boolean
  isInactive: boolean
  onClick?: () => void
  contextMenuItems?: ContextMenuItemComponent<ContextProps>
}

export default function Day<ContextProps>(
  props: Props<ContextProps>
): JSX.Element {
  const { day, month, contextMenuItems } = props

  const isSameMonth = day.date.month() === month.month()

  return (
    <div className={style.day}>
      {contextMenuItems && <DayInnerContext {...props} />}
      {!contextMenuItems && <DayInnerNoContext {...props} />}
    </div>
  )
}

function DayInnerNoContext(props: Props<any>): JSX.Element {
  const { day, onClick, isFocused, isActive, isInactive } = props

  return (
    <div
      className={cx(style.dayInner, {
        [style.dayInnerFocused]: isFocused,
        [style.dayInnerActive]: !isFocused && isActive,
        [style.dayInnerInactive]: isInactive
      })}
      onClick={onClick}>
      <Label className="text-sm text-center">{day.date.format("D")}</Label>
    </div>
  )
}

function DayInnerContext<ContextProps>(
  props: Props<ContextProps>
): JSX.Element {
  const ItemComponent = props.contextMenuItems

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <DayInnerNoContext {...props} />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ItemComponent {...({} as ContextProps)} />
      </ContextMenuContent>
    </ContextMenu>
  )
}
