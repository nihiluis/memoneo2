import {
  ChevronDownIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import React, { Suspense, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { GOAL_OVERVIEW_CONNECTION } from "../../constants/connections"
import { useFilterStore } from "../../stores/filter"
import Badge from "../ui/Badge"
import { DropdownMenuRoot, DropdownMenuTrigger } from "../ui/menu/DropdownMenu"
import OverviewDropdownMenuContent from "./OverviewDropdownMenuContent"
import { OverviewGoalInnerQuery } from "./__generated__/OverviewGoalInnerQuery.graphql"

export default function GoalOverview(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <OverviewGoalInner />
    </Suspense>
  )
}

function OverviewGoalInner(): JSX.Element {
  const [showArchived, setShowArchived] = useState(false)

  const data = useLazyLoadQuery<OverviewGoalInnerQuery>(
    graphql`
      query OverviewGoalInnerQuery($archived: [Boolean!]!) {
        goal_connection(
          first: 100
          order_by: { created_at: desc }
          where: { archived: { _in: $archived } }
        ) @connection(key: "OverviewGoalInnerQuery_goal_connection") {
          edges {
            node {
              id
              description
              title
              status
              progress
              rank
              archived
            }
          }
        }
      }
    `,
    { archived: showArchived ? [false, true] : [false] }
  )

  /*
  useEffect(() => {
    setFilter(GOAL_OVERVIEW_CONNECTION, {
      order_by: { created_at: "desc" },
      where: { archived: { _eq: showArchived } },
    })
  }, [showArchived])
  */

  const items = data.goal_connection.edges.map(edge => edge.node)

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
