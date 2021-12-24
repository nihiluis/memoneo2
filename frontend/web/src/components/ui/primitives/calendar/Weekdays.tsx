import React from "react"
import Label from "../Label"

import style from "./Calendar.module.css"

const SHOULD_NOT_UPDATE = true

interface WeekColumnProps {
  day: string
}

const WeekColumn = React.memo<WeekColumnProps>(
  function WeekColumn(props: WeekColumnProps) {
    return (
      <div className={style.weekColumn}>
        <Label>{props.day}</Label>
      </div>
    )
  },
  () => SHOULD_NOT_UPDATE
)

interface WeekColumnsProps {
  days: string[]
}

export default React.memo<WeekColumnsProps>(
  function Weekdays(props: WeekColumnsProps) {
    return (
      <div className={style.weekdays}>
        {props.days.map((day: string) => (
          <WeekColumn key={day} day={day} />
        ))}
      </div>
    )
  },
  () => SHOULD_NOT_UPDATE
)
