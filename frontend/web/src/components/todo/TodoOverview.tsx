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

type Item = DataLoaderInnerTodoQueryResponse["todo_connection"]["edges"][0]["node"]

export default function TodoOverview(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <GoalOverviewInner />
    </Suspense>
  )
}

function GoalOverviewInner(): JSX.Element {
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
    <div className="bg-content">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="leading-none">Activities</h2>
        <ChevronRightIcon color="gray" width={24} height={24} />
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <DotsHorizontalIcon color="gray" width={24} height={24} />
          </DropdownMenuTrigger>
          <OverviewDropdownMenuContent
            showArchived={showArchived}
            setShowArchived={setShowArchived}
          />
        </DropdownMenuRoot>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map(item => (
          <TodoOverviewItem<Item>
            key={`overview-item-${item.id}`}
            item={item}
          />
        ))}
      </div>
    </div>
  )
}
