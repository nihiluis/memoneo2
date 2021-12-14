import dayjs, { Dayjs } from "dayjs"
import React, { Suspense, useContext, useState } from "react"
import { usePreloadedQuery } from "react-relay"
import { DataLoaderContext } from "../DataLoader"
import { defaultNoteQuery } from "../DataLoader.gql"
import Calendar from "../ui/primitives/calendar/Calendar"
import {
  DataLoaderInnerNoteQuery,
  DataLoaderInnerNoteQueryResponse,
} from "../__generated__/DataLoaderInnerNoteQuery.graphql"

import style from "./Overview.module.css"

interface Props {
  className?: string
}

export default function NoteCalendarOverview(props: Props): JSX.Element {
  return (
    <Suspense fallback={null}>
      <NoteCalendarOverviewInner {...props} />
    </Suspense>
  )
}

function NoteCalendarOverviewInner(props: Props): JSX.Element {
  const [showArchived, setShowArchived] = useState(false)
  const [focusedDay, setFocusedDay] = useState<Dayjs>(dayjs())
  const [activeMonth, setActiveMonth] = useState<Dayjs>(dayjs())

  const { noteQueryRef } = useContext(DataLoaderContext)

  const data = usePreloadedQuery<DataLoaderInnerNoteQuery>(
    defaultNoteQuery,
    noteQueryRef
  )

  const items = data.note_connection.edges
    .map(edge => edge.node)
    .filter(node => (showArchived ? node : !node.archived))

  return (
    <div>
      <Calendar
        focusedDay={focusedDay}
        focusDay={setFocusedDay}
        month={activeMonth}
        setMonth={month => setActiveMonth(activeMonth.month(month))}
        className={style.calendar}
      />
    </div>
  )
}
