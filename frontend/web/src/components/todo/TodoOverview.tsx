import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import React, { Suspense, useContext, useState } from "react"
import { usePreloadedQuery } from "react-relay"
import { DataLoaderContext } from "../DataLoader"
import { defaultTodoQuery } from "../DataLoader.gql"
import { DropdownMenuRoot, DropdownMenuTrigger } from "../ui/menu/DropdownMenu"
import {
  DataLoaderInnerTodoQuery,
  DataLoaderInnerTodoQueryResponse,
} from "../__generated__/DataLoaderInnerTodoQuery.graphql"
import OverviewDropdownMenuContent from "../overview/DropdownMenuContent"
import TodoOverviewItem from "./TodoOverviewItem"
import OverviewSimpleWrapper from "../overview/OverviewSimpleWrapper"

type Item = DataLoaderInnerTodoQueryResponse["todo_connection"]["edges"][0]["node"]

interface Props {
  className?: string
}

export default function TodoOverview(props: Props): JSX.Element {
  return (
    <Suspense fallback={null}>
      <TodoOverviewInner {...props} />
    </Suspense>
  )
}

function TodoOverviewInner(props: Props): JSX.Element {
  const [showArchived, setShowArchived] = useState(false)

  const { todoQueryRef } = useContext(DataLoaderContext)

  const data = usePreloadedQuery<DataLoaderInnerTodoQuery>(
    defaultTodoQuery,
    todoQueryRef
  )

  const items = data.todo_connection.edges
    .map(edge => edge.node)
    .filter(node => (showArchived ? node : !node.archived))

  return (
    <OverviewSimpleWrapper
      title="Todos"
      showArchived={showArchived}
      setShowArchived={setShowArchived}
      className={props.className}>
      {items.map(item => (
        <TodoOverviewItem<Item> key={`overview-item-${item.id}`} item={item} />
      ))}
    </OverviewSimpleWrapper>
  )
}
