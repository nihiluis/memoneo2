import dayjs, { Dayjs } from "dayjs"

export type DayType = {
  date: Dayjs
  id: string
  isActive: boolean
  isEndDate: boolean
  isHidden: boolean
  isMonthDate: boolean
  isOutOfRange: boolean
  isStartDate: boolean
  isToday: boolean
  isVisible: boolean
}

const MAX_DATE = new Date(8640000000000000)
const MIN_DATE = new Date(-8640000000000000)

const MONDAY_FIRST = [6, 0, 1, 2, 3, 4, 5]

export function isDay(day: number) {
  return Number.isInteger(day) && day >= 1 && day <= 31
}

export function isMonth(month: number) {
  return Number.isInteger(month) && month >= 0 && month < 12
}

export function isYear(year: number) {
  return (
    Number.isInteger(year) &&
    year >= MIN_DATE.getFullYear() &&
    year <= MAX_DATE.getFullYear()
  )
}

export function leapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function isLeapYear(year: number) {
  return isYear(year) && leapYear(year)
}

function dayShouldBeActive(
  date: Dayjs,
  startDate: Dayjs,
  endDate: Dayjs,
  firstDayOfMonth: Dayjs,
  lastDayOfMonth: Dayjs
) {
  if (date > lastDayOfMonth) {
    return endDate > lastDayOfMonth && startDate <= lastDayOfMonth
  }

  return startDate < firstDayOfMonth && endDate >= firstDayOfMonth
}

export function getMonthDays(
  month: number,
  year: number,
  firstDayMonday: boolean,
  disabledDays: { [key: string]: any },
  disableOffsetDays: boolean,
  startDate?: Dayjs,
  endDate?: Dayjs,
  minDate?: Dayjs,
  maxDate?: Dayjs
): DayType[] {
  minDate?.hour(0)
  maxDate?.hour(0)
  startDate?.hour(0)
  endDate?.hour(0)

  const firstMonthDay = dayjs(new Date(year, month, 1))
  const lastMonthDay = dayjs(new Date(year, month + 1, 0))

  const daysToAdd = firstMonthDay.daysInMonth()
  const days: DayType[] = []

  const startWeekOffset = firstDayMonday
    ? MONDAY_FIRST[firstMonthDay.day()]
    : firstMonthDay.day()
  const daysToCompleteRows = (startWeekOffset + daysToAdd) % 7
  const lastRowNextMonthDays = daysToCompleteRows ? 7 - daysToCompleteRows : 0

  for (let i = -startWeekOffset; i < daysToAdd + lastRowNextMonthDays; i++) {
    const date = firstMonthDay.add(i, "day")
    const day = date.day()
    const month = date.month()
    const fullDay = day < 10 ? `0${day}` : day.toString()
    const fullMonth = month < 10 ? `0${month + 1}` : (month + 1).toString()
    const id = `${date.year()}-${fullMonth}-${fullDay}`

    let isOnSelectableRange = !minDate && !maxDate

    isOnSelectableRange =
      (!minDate || (minDate && date >= minDate)) &&
      (!maxDate || (maxDate && date <= maxDate))

    const isOutOfRange = !!(
      (minDate && date < minDate) ||
      (maxDate && date > maxDate)
    )
    const isMonthDate = i >= 0 && i < daysToAdd
    let isStartDate = false
    let isEndDate = false
    let isActive = false

    if (endDate && startDate) {
      isStartDate = isMonthDate && date.isSame(startDate)
      isEndDate = isMonthDate && date.isSame(endDate)

      if (!isMonthDate) {
        isActive = dayShouldBeActive(
          date,
          startDate,
          endDate,
          firstMonthDay,
          lastMonthDay
        )
      } else {
        isActive = date >= startDate && date <= endDate
      }
    } else if (isMonthDate && startDate && date.isSame(startDate)) {
      isStartDate = true
      isEndDate = true
      isActive = true
    }

    const today = new Date()
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()

    days.push({
      id: `${month}-${id}`,
      date,
      isToday,
      isMonthDate,
      isActive,
      isStartDate,
      isEndDate,
      isOutOfRange,
      isVisible:
        isOnSelectableRange &&
        isMonthDate &&
        !disabledDays[`${year}-${fullMonth}-${day}`],
      isHidden: disableOffsetDays && !isMonthDate,
    })
  }

  return days
}

export function getMonthNames(): string[] {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
}

function getWeekdayNames() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
}

export function getDayNames(firstDayMonday: boolean) {
  const days = getWeekdayNames()
  if (firstDayMonday) {
    const sunday = days.shift() as string
    days.push(sunday)
    return days
  }

  return days
}
