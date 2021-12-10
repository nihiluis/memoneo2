import {
  ChevronDownIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import React, { Suspense, useContext, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery, usePreloadedQuery } from "react-relay"
import { GOAL_OVERVIEW_CONNECTION } from "../../constants/connections"
import { useFilterStore } from "../../stores/filter"
import { DataLoaderContext } from "../DataLoader"
import { defaultGoalQuery } from "../DataLoader.gql"
import Badge from "../ui/Badge"
import { DropdownMenuRoot, DropdownMenuTrigger } from "../ui/menu/DropdownMenu"
import { DataLoaderInnerGoalQuery } from "../__generated__/DataLoaderInnerGoalQuery.graphql"
import OverviewDropdownMenuContent from "./OverviewDropdownMenuContent"

export default function GoalOverview(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <OverviewGoalInner />
    </Suspense>
  )
}

function OverviewGoalInner(): JSX.Element {
  const [showArchived, setShowArchived] = useState(false)

  const { goalQueryRef } = useContext(DataLoaderContext)

  const data = usePreloadedQuery<DataLoaderInnerGoalQuery>(
    defaultGoalQuery,
    goalQueryRef
  )

  const items = data.goal_connection.edges
    .map(edge => edge.node)
    .filter(node => (showArchived ? node : !node.archived))

  return (
    <div className="bg-content">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="leading-none">Goals</h2>
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
          <Badge key={item.id} title={item.title} />
        ))}
      </div>
    </div>
  )
}
