import {
  ChevronDownIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import React, { Suspense, useContext, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery, usePreloadedQuery } from "react-relay"
import { GOAL_OVERVIEW_CONNECTION } from "../../../constants/connections"
import { useFilterStore } from "../../../stores/filter"
import { DataLoaderContext } from "../../DataLoader"
import { defaultGoalQuery } from "../../DataLoader.gql"
import Badge from "../../ui/Badge"
import { DropdownMenuRoot, DropdownMenuTrigger } from "../../ui/menu/DropdownMenu"
import { DialogContent, DialogRoot, DialogTitle } from "../../ui/primitives/Dialog"
import { SeparatorHorizontal } from "../../ui/Separator"
import {
  DataLoaderInnerGoalQuery,
  DataLoaderInnerGoalQueryResponse,
} from "../../__generated__/DataLoaderInnerGoalQuery.graphql"
import GoalMutate from "./GoalMutate"
import OverviewDropdownMenuContent from "../../overview/DropdownMenuContent"
import GoalOverviewItem from "./GoalOverviewItem"
import OverviewSimpleWrapper from "../../overview/OverviewSimpleWrapper"

type Item = DataLoaderInnerGoalQueryResponse["goal_connection"]["edges"][0]["node"]

interface Props {
  className?: string
}

export default function GoalOverview(props: Props): JSX.Element {
  return (
    <Suspense fallback={null}>
      <GoalOverviewInner {...props} />
    </Suspense>
  )
}

function GoalOverviewInner(props: Props): JSX.Element {
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
    <OverviewSimpleWrapper
      title="Goals"
      showArchived={showArchived}
      setShowArchived={setShowArchived}
      className={props.className}>
      <div className="flex flex-wrap gap-1">
        {items.map(item => (
          <GoalOverviewItem<Item>
            key={`overview-item-${item.id}`}
            item={item}
          />
        ))}
      </div>
    </OverviewSimpleWrapper>
  )
}
