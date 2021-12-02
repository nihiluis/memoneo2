import React, { Suspense, useEffect, useState } from "react"
import {
  SidebarCollapsible,
  SidebarCollapsibleItem,
} from "../ui/sidebar/Collapsible"
import { graphql, useLazyLoadQuery } from "react-relay"
import { LeftSidebarInnerQuery } from "./__generated__/LeftSidebarInnerQuery.graphql"

export default function LeftSidebar(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <LeftSidebarInner />
    </Suspense>
  )
}

function LeftSidebarInner(): JSX.Element {
  const data = useLazyLoadQuery<LeftSidebarInnerQuery>(
    graphql`
      query LeftSidebarInnerQuery {
        goal_connection(first: 100, order_by: { created_at: desc })
          @connection(key: "LeftSidebarInnerQuery_goal_connection") {
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

  const goals = data.goal_connection.edges.map(edge => edge.node)

  return (
    <SidebarCollapsible title="Goals">
      {goals.map(goal => (
        <SidebarCollapsibleItem title={goal.title}></SidebarCollapsibleItem>
      ))}
    </SidebarCollapsible>
  )
}
