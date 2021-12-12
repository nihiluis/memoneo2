import { Dayjs } from "dayjs"
import React from "react"
import Month from "./Month"

interface Props {
  month: Dayjs
  focusedDay: Dayjs
  focusDay: (day: Dayjs) => void
  setMonth: (month: number) => void
}

export default function Calendar(props: Props): JSX.Element {
  const { month, focusedDay, focusDay, setMonth } = props

  return (
    <div>
      <Month
        month={month}
        focusedDay={focusedDay}
        setMonth={setMonth}
        focusDay={focusDay}
      />
    </div>
  )
}
