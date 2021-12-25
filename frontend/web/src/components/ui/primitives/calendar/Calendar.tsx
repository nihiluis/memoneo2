import { Dayjs } from "dayjs"
import React from "react"
import Month from "./Month"

import style from "./Calendar.module.css"
import { cx } from "../../../../lib/reexports"

export type BaseContextProps = {
  setContextOpen(open: boolean): void
}

interface Props {
  month: Dayjs
  focusedDay: Dayjs
  activeDays: Dayjs[]
  focusDay: (day: Dayjs) => void
  setMonth: (month: number) => void
  className?: string
  contextMenuItems?: ContextMenuItemComponent
}

export type ContextMenuItemComponent = (props: BaseContextProps) => JSX.Element

export default function Calendar(props: Props): JSX.Element {
  const {
    month,
    focusedDay,
    focusDay,
    setMonth,
    className,
    contextMenuItems,
    activeDays,
  } = props

  return (
    <div className={cx(style.calendar, className)}>
      <Month
        month={month}
        focusedDay={focusedDay}
        setMonth={setMonth}
        focusDay={focusDay}
        contextMenuItems={contextMenuItems}
        activeDays={activeDays}
      />
    </div>
  )
}
