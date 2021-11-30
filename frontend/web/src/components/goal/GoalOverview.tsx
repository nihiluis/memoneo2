import React, { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import Badge from "../ui/Badge"
import { GoalOverviewInnerQuery } from "./__generated__/GoalOverviewInnerQuery.graphql"

export default function GoalOverview(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <GoalOverviewInner />
    </Suspense>
  )
}

function GoalOverviewInner(): JSX.Element {
  const data = useLazyLoadQuery<GoalOverviewInnerQuery>(
    graphql`
      query GoalOverviewInnerQuery {
        goal_connection(first: 100, order_by: { created_at: desc })
          @connection(key: "GoalOverviewInnerQuery_goal_connection") {
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
      <h2 className="mb-2">Goals</h2>
      <div className="flex">
        {items.map(item => (
          <Badge title={item.title} />
        ))}
        <Badge title="+" />
      </div>
    </div>
  )
}
