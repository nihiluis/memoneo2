import {
  ChevronDownIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import React, { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import Badge from "../ui/Badge"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuTriggerButton,
} from "../ui/menu/DropdownMenu"
import MiniBadge from "../ui/MiniBadge"
import { OverviewGoalInnerQuery } from "./__generated__/OverviewGoalInnerQuery.graphql"

export default function GoalOverview(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <OverviewGoalInner />
    </Suspense>
  )
}

function OverviewGoalInner(): JSX.Element {
  const data = useLazyLoadQuery<OverviewGoalInnerQuery>(
    graphql`
      query OverviewGoalInnerQuery {
        goal_connection(first: 100, order_by: { created_at: desc })
          @connection(key: "OverviewGoalInnerQuery_goal_connection") {
          edges {
            node {
              id
              description
              title
              status
              progress
              rank
              deleted
            }
          }
        }
      }
    `,
    {}
  )

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
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>
      <div className="flex">
        {items.map(item => (
          <Badge key={item.id} title={item.title} />
        ))}
      </div>
    </div>
  )
}
