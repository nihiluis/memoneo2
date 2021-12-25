import React, { useState } from "react"
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
import { BaseContextProps, ContextMenuItemComponent } from "./Calendar"

interface Props {
  day: DayType
  month: Dayjs
  isFocused: boolean
  isActive: boolean
  isInactive: boolean
  onClick?: () => void
  contextMenuItems?: ContextMenuItemComponent
}

export default function Day(props: Props): JSX.Element {
  const { day, month, contextMenuItems } = props

  const isSameMonth = day.date.month() === month.month()

  return (
    <div className={style.day}>
      {contextMenuItems && <DayInnerContext {...props} />}
      {!contextMenuItems && <DayInnerNoContext {...props} />}
    </div>
  )
}

function DayInnerNoContext(props: Props): JSX.Element {
  const { day, onClick, isFocused, isActive, isInactive } = props

  return (
    <div
      className={cx(style.dayInner, {
        [style.dayInnerFocused]: isFocused,
        [style.dayInnerActive]: !isFocused && isActive,
        [style.dayInnerInactive]: isInactive,
      })}
      onClick={onClick}>
      <Label className="text-sm text-center">{day.date.format("D")}</Label>
    </div>
  )
}

function DayInnerContext(props: Props): JSX.Element {
  const ItemComponent = props.contextMenuItems

  const [contextOpen, setContextOpen] = useState(false)

  return (
    <ContextMenu onOpenChange={setContextOpen}>
      <ContextMenuTrigger>
        <DayInnerNoContext {...props} />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ItemComponent {...({ setContextOpen } as BaseContextProps)} />
      </ContextMenuContent>
    </ContextMenu>
  )
}
