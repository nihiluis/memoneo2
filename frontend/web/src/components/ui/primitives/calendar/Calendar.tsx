import { Dayjs } from "dayjs"
import React from "react"
import Month from "./Month"

import style from "./Calendar.module.css"
import { cx } from "../../../../lib/reexports"

interface Props {
  month: Dayjs
  focusedDay: Dayjs
  focusDay: (day: Dayjs) => void
  setMonth: (month: number) => void
  className?: string
}

export default function Calendar(props: Props): JSX.Element {
  const { month, focusedDay, focusDay, setMonth, className } = props

  return (
    <div className={cx(style.calendar, className)}>
      <Month
        month={month}
        focusedDay={focusedDay}
        setMonth={setMonth}
        focusDay={focusDay}
      />
    </div>
  )
}
