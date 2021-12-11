import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import React, { Suspense, useContext, useEffect, useState } from "react"
import { usePreloadedQuery } from "react-relay"
import { DataLoaderContext } from "../DataLoader"
import { defaultActivityQuery, defaultGoalQuery } from "../DataLoader.gql"
import { DropdownMenuRoot, DropdownMenuTrigger } from "../ui/menu/DropdownMenu"
import {
  DataLoaderInnerActivityQuery,
  DataLoaderInnerActivityQueryResponse,
} from "../__generated__/DataLoaderInnerActivityQuery.graphql"
import OverviewDropdownMenuContent from "../overview/DropdownMenuContent"
import ActivityOverviewItem from "./ActivityOverviewItem"

type Item = DataLoaderInnerActivityQueryResponse["activity_connection"]["edges"][0]["node"]

export default function ActivityOverview(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <GoalOverviewInner />
    </Suspense>
  )
}

function GoalOverviewInner(): JSX.Element {
  const [showArchived, setShowArchived] = useState(false)

  const { activityQueryRef } = useContext(DataLoaderContext)

  const data = usePreloadedQuery<DataLoaderInnerActivityQuery>(
    defaultActivityQuery,
    activityQueryRef
  )

  const items = data.activity_connection.edges
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
          <ActivityOverviewItem<Item>
            key={`overview-item-${item.id}`}
            item={item}
          />
        ))}
      </div>
    </div>
  )
}
