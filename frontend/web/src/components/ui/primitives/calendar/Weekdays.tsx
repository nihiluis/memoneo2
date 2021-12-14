import React from "react"
import Label from "../Label"

import style from "./Calendar.module.css"

const SHOULD_NOT_UPDATE = true

interface WeekColumnProps {
  day: string
}

const WeekColumn = React.memo<WeekColumnProps>(
  (props: WeekColumnProps) => (
    <div className={style.weekColumn}>
      <Label>{props.day}</Label>
    </div>
  ),
  () => SHOULD_NOT_UPDATE
)

interface WeekColumnsProps {
  days: string[]
}

export default React.memo<WeekColumnsProps>(
  (props: WeekColumnsProps) => (
    <div className={style.weekdays}>
      {props.days.map((day: string) => (
        <WeekColumn key={day} day={day} />
      ))}
    </div>
  ),
  () => SHOULD_NOT_UPDATE
)
