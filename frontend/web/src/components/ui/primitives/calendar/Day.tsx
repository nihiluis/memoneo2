import React from "react"
import { Dayjs } from "dayjs"
import { DayType } from "../../../../lib/month"
import Label from "../Label"
import { cx } from "../../../../lib/reexports"

import style from "./Calendar.module.css"

interface Props {
  day: DayType
  month: Dayjs
  isFocused: boolean
  onClick?: () => void
}

export default function Day(props: Props): JSX.Element {
  const { day, month, isFocused, onClick } = props

  const isSameMonth = day.date.month() === month.month()

  return (
    <div className={style.day}>
      <div
        className={cx(style.dayInner, { [style.dayInnerFocused]: isFocused })}
        onClick={onClick}>
        <Label className="text-sm text-center">{day.date.format("D")}</Label>
      </div>
    </div>
  )
}
