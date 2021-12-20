import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { Dayjs } from "dayjs"
import React, { useEffect, useState } from "react"
import { DayType, getDayNames, getMonthDays } from "../../../../lib/month"
import Label from "../Label"
import Day from "./Day"
import Weekdays from "./Weekdays"
import style from "./Calendar.module.css"
import { SeparatorHorizontal } from "../../Separator"
import { ContextMenuItemComponent } from "./Calendar"

interface Props<ContextProps> {
  month: Dayjs
  onPress?: () => void
  showWeekdays?: boolean
  firstDayMonday?: boolean
  focusedDay: Dayjs
  activeDays: Dayjs[]
  focusDay: (day: Dayjs) => void
  setMonth: (month: number) => void
  contextMenuItems?: ContextMenuItemComponent<ContextProps>
}

type ActiveDayTypeMap = { [id: string]: boolean }

export default function Month<ContextProps>(
  props: Props<ContextProps>
): JSX.Element {
  const {
    month,
    firstDayMonday = true,
    focusedDay,
    activeDays,
    focusDay,
    setMonth,
    showWeekdays = true,
    contextMenuItems,
  } = props

  const [days, setDays] = useState<DayType[]>([])
  const [activeDayTypes, setActiveDayTypes] = useState<ActiveDayTypeMap>({})
  const [dayNames, setDayNames] = useState<string[]>([])

  useEffect(() => {
    setDayNames(getDayNames(firstDayMonday))
  }, [firstDayMonday])

  useEffect(() => {
    const days = getMonthDays(
      month.month(),
      month.year(),
      firstDayMonday,
      [],
      false
    )

    setDays(days)
  }, [month, firstDayMonday])

  const weeks: DayType[][] = []

  const tmpDays = [...days]
  while (tmpDays.length) {
    weeks.push(tmpDays.splice(0, 7))
  }

  useEffect(() => {
    const newActiveDayTypes: ActiveDayTypeMap = {}

    for (let day of days) {
      for (let activeDay of activeDays) {
        if (day.date.isSame(activeDay, "day")) {
          newActiveDayTypes[day.date.format("YYYY-MM-DD")] = true
        }
      }
    }

    setActiveDayTypes(newActiveDayTypes)
  }, [activeDays, days])

  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <ChevronLeftIcon
          color="var(--icon-color)"
          width={20}
          height={20}
          className="icon-bg icon-20"
          onClick={() => setMonth(month.month() - 1)}
        />
        <div className={style.monthName}>
          <Label className="text-center text-white">
            {month.format("MMMM, YYYY")}
          </Label>
        </div>
        <ChevronRightIcon
          color="var(--icon-color)"
          width={20}
          height={20}
          className="icon-bg icon-20"
          onClick={() => setMonth(month.month() + 1)}
        />
      </div>
      {showWeekdays && (
        <React.Fragment>
          <Weekdays days={dayNames} />
          <SeparatorHorizontal />
        </React.Fragment>
      )}
      <div>
        {weeks.map((week, idx) => (
          <div key={`week-${idx}`} className={style.week}>
            {week.map(day => (
              <Day
                key={`day-${day.id}`}
                day={day}
                month={month}
                onClick={() => {
                  if (!day.date.isSame(month, "month")) return
                  
                  focusDay(day.date)
                }}
                isInactive={!day.date.isSame(month, "month")}
                isActive={activeDayTypes.hasOwnProperty(
                  day.date.format("YYYY-MM-DD")
                )}
                isFocused={day.date.isSame(focusedDay, "day")}
                contextMenuItems={contextMenuItems}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
