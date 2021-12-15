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
import OverviewSimpleWrapper from "../overview/OverviewSimpleWrapper"

type Item = DataLoaderInnerActivityQueryResponse["activity_connection"]["edges"][0]["node"]

interface Props {
  className?: string
}

export default function ActivityOverview(props: Props): JSX.Element {
  return (
    <Suspense fallback={null}>
      <ActivityOverviewInner {...props} />
    </Suspense>
  )
}

function ActivityOverviewInner(props: Props): JSX.Element {
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
    <OverviewSimpleWrapper
      title="Activities"
      showArchived={showArchived}
      setShowArchived={setShowArchived}
      className={props.className}>
      <div className="flex flex-wrap gap-1">
        {items.map(item => (
          <ActivityOverviewItem<Item>
            key={`overview-item-${item.id}`}
            item={item}
          />
        ))}
      </div>
    </OverviewSimpleWrapper>
  )
}
