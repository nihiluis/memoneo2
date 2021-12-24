import React from "react"
import { FormikProps } from "formik"
import { Switch } from "../primitives/Switch"
import Calendar from "../primitives/calendar/Calendar"
import { dayjs } from "../../../lib/reexports"

interface Props<T> extends FormikProps<T> {
  label: string
  name: string
  innerClassName?: string
}

export default function FormRowCalendar<T>(props: Props<T>) {
  const { label, name, setFieldValue, values, innerClassName = "" } = props

  return (
    <div className="form-row">
      <label className="form-label">{label}</label>
      <Calendar
        activeDays={[]}
        focusedDay={values[name]}
        focusDay={day => setFieldValue(name, day)}
        month={dayjs()}
        setMonth={() => {}}
      />
      <Switch
        checked={values[name]}
        onCheckedChange={() => setFieldValue(name, !values[name])}
      />
    </div>
  )
}
