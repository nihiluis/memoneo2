import React, { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
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
    <React.Fragment>
      {items.map(item => (
        <p>{item.title}</p>
      ))}
    </React.Fragment>
  )
}
