import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { Dayjs } from "dayjs"
import React from "react"
import { DayType, getDayNames, getMonthDays } from "../../../../lib/month"
import { cx } from "../../../../lib/reexports"
import Label from "../Label"
import Day from "./Day"
import Weekdays from "./Weekdays"

interface Props {
  month: Dayjs
  onPress?: () => void
  showWeekdays?: boolean
  firstDayMonday?: boolean
  focusedDay: Dayjs
  focusDay: (day: Dayjs) => void
  setMonth: (month: number) => void
}

export default function Month(props: Props): JSX.Element {
  const {
    month,
    firstDayMonday = true,
    focusedDay,
    focusDay,
    setMonth,
    showWeekdays = true,
  } = props

  const days = getMonthDays(
    month.month(),
    month.year(),
    firstDayMonday,
    [],
    false
  )
  const dayNames = getDayNames(firstDayMonday)

  const weeks: DayType[][] = []

  while (days.length) {
    weeks.push(days.splice(0, 7))
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <ChevronLeftIcon
          color="var(--icon-color)"
          className="mx-3"
          onClick={() => setMonth(month.month() - 1)}
        />
        <div className={cx()}>
          <Label className="text-center text-white">
            {month.format("MMMM, YYYY")}
          </Label>
        </div>
        <ChevronRightIcon
          color="var(--icon-color)"
          className="mx-3"
          onClick={() => setMonth(month.month() - 1)}
        />
      </div>
      {showWeekdays && <Weekdays days={dayNames} />}
      <div>
        {weeks.map((week, idx) => (
          <div key={`week-${idx}`} className="flex">
            {week.map(day => {
              return (
                <Day
                  key={`day-${day.id}`}
                  day={day}
                  month={month}
                  onClick={() => focusDay(day.date)}
                  isFocused={day.date.isSame(focusedDay, "day")}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
