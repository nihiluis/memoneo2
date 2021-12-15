import { PlusIcon } from "@radix-ui/react-icons"
import dayjs, { Dayjs } from "dayjs"
import React, { Suspense, useContext, useEffect, useState } from "react"
import { usePreloadedQuery } from "react-relay"
import { DataLoaderContext } from "../DataLoader"
import { defaultNoteQuery } from "../DataLoader.gql"
import OverviewSimpleWrapper from "../overview/OverviewSimpleWrapper"
import Button from "../ui/primitives/Button"
import Calendar from "../ui/primitives/calendar/Calendar"
import { ContextMenuItem } from "../ui/primitives/ContextMenu"
import { SeparatorHorizontal } from "../ui/Separator"
import {
  DataLoaderInnerNoteQuery,
  DataLoaderInnerNoteQueryResponse,
} from "../__generated__/DataLoaderInnerNoteQuery.graphql"

import style from "./Overview.module.css"

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
      .filter(node => {
        if (!showArchived && node.archived) {
          return false
        }

        return node.date === focusedDay.format("YYYY-MM-DD")
      })

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
        {shownItems.map(item => (
          <NoteCalendarItem key={`item-${item.id}`} item={item} />
        ))}
      </div>
    </OverviewSimpleWrapper>
  )
}

interface ItemProps {
  item: Item
}

function NoteCalendarItem(props: ItemProps): JSX.Element {
  const { item } = props

  return (
    <div className="mt-2">
      <SeparatorHorizontal className="mb-2" />
      <p>{item.title}</p>
    </div>
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
