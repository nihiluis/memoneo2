import React from "react"
import Label from "../Label"

const SHOULD_NOT_UPDATE = true

interface WeekColumnProps {
  day: string
}

const WeekColumn = React.memo<WeekColumnProps>(
  (props: WeekColumnProps) => (
    <div className="flex items-center mb-2">
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
    <div className="flex gap-2">
      {props.days.map((day: string) => (
        <WeekColumn key={day} day={day} />
      ))}
    </div>
  ),
  () => SHOULD_NOT_UPDATE
)
