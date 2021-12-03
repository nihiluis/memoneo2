import React, { Suspense, useEffect, useState } from "react"
import {
  SidebarCollapsible,
  SidebarCollapsibleButton,
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

  const notes = []
  const goals = data.goal_connection.edges.map(edge => edge.node)
  const activities = []
  const todos = []

  return (
    <div>
      <LeftSidebarContent title="Notes" items={notes}></LeftSidebarContent>
      <LeftSidebarContent title="Todos" items={todos}></LeftSidebarContent>
      <LeftSidebarContent title="Goals" items={goals}></LeftSidebarContent>
      <LeftSidebarContent
        title="Activities"
        items={activities}></LeftSidebarContent>
    </div>
  )
}

interface ContentProps {
  items: ContentItem[]
  title: string
}

interface ContentItem {
  title: string
}

function LeftSidebarContent(props: ContentProps): JSX.Element {
  const { items, title } = props

  return (
    <SidebarCollapsible title={title}>
      <div className="mb-1">
        {items.map(item => (
          <SidebarCollapsibleItem title={item.title}></SidebarCollapsibleItem>
        ))}
        {items.length === 0 && (
          <SidebarCollapsibleItem
            title="Nothing found."
            hideIcon
            pointer={false}
          />
        )}
      </div>
      <SidebarCollapsibleButton title="Create new" />
    </SidebarCollapsible>
  )
}
