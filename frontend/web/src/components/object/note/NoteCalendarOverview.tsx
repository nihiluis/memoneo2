import { PlusIcon } from "@radix-ui/react-icons"
import dayjs, { Dayjs } from "dayjs"
import React, { Suspense, useContext, useEffect, useState } from "react"
import { usePreloadedQuery } from "react-relay"
import NoteListItem from "./NoteListItem"
import { DataLoaderContext } from "../../DataLoader"
import { defaultNoteQuery } from "../../DataLoader.gql"
import List from "../../list/List"
import OverviewSimpleWrapper from "../../overview/OverviewSimpleWrapper"
import Calendar from "../../ui/primitives/calendar/Calendar"
import { ContextMenuItem } from "../../ui/primitives/ContextMenu"
import {
  DataLoaderInnerNoteQuery,
  DataLoaderInnerNoteQueryResponse,
} from "../../__generated__/DataLoaderInnerNoteQuery.graphql"

import style from "./Overview.module.css"
import NoteEditor from "./NoteEditor"
import { DEFAULT_NOTE_CONNECTION } from "../../../constants/connections"

interface Props {
  className?: string
}

type Item = DataLoaderInnerNoteQueryResponse["note_connection"]["edges"][0]["node"]

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

  const [shownItems, setShownItems] = useState<Item[]>([])

  useEffect(() => {
    const items: Item[] = data.note_connection.edges
      .map(edge => edge.node)
      .filter(node => node.date === focusedDay.format("YYYY-MM-DD"))

    setShownItems(items)
  }, [data, focusedDay, showArchived])

  return (
    <OverviewSimpleWrapper
      title="Notes"
      showArchived={showArchived}
      setShowArchived={setShowArchived}
      className="mb-10">
      <Calendar
        focusedDay={focusedDay}
        focusDay={setFocusedDay}
        month={activeMonth}
        setMonth={month => setActiveMonth(activeMonth.month(month))}
        className={style.calendar}
        contextMenuItems={ContextMenuItems}
      />
      <div className="mt-4">
        <List<Item>
          items={shownItems}
          type="note"
          ItemComponent={NoteListItem}
          MutateComponent={NoteEditor}
          connection={DEFAULT_NOTE_CONNECTION}
          showArchived={showArchived}
        />
      </div>
    </OverviewSimpleWrapper>
  )
}

function ContextMenuItems<ContextProps>(props: ContextProps) {
  return (
    <ContextMenuItem onClick={() => {}} className="flex gap-2">
      <PlusIcon
        color="var(--icon-color)"
        width={20}
        height={20}
        className="icon-20"
      />
      <p>Add note</p>
    </ContextMenuItem>
  )
}
