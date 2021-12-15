import { Dayjs } from "dayjs"
import React from "react"
import Month from "./Month"

import style from "./Calendar.module.css"
import { cx } from "../../../../lib/reexports"

interface Props<ContextProps> {
  month: Dayjs
  focusedDay: Dayjs
  focusDay: (day: Dayjs) => void
  setMonth: (month: number) => void
  className?: string
  contextMenuItems?: ContextMenuItemComponent<ContextProps>
}

export type ContextMenuItemComponent<ContextProps> = (
  props: ContextProps
) => JSX.Element

export default function Calendar<ContextProps>(
  props: Props<ContextProps>
): JSX.Element {
  const {
    month,
    focusedDay,
    focusDay,
    setMonth,
    className,
    contextMenuItems,
  } = props

  return (
    <div className={cx(style.calendar, className)}>
      <Month<ContextProps>
        month={month}
        focusedDay={focusedDay}
        setMonth={setMonth}
        focusDay={focusDay}
        contextMenuItems={contextMenuItems}
      />
    </div>
  )
}
