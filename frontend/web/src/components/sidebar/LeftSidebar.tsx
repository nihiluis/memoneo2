import React, { Suspense, useEffect, useState } from "react"
import {
  SidebarCollapsible,
  SidebarCollapsibleButton,
  SidebarCollapsibleItem,
} from "../ui/sidebar/Collapsible"
import { graphql, useLazyLoadQuery } from "react-relay"
import { LeftSidebarInnerQuery } from "./__generated__/LeftSidebarInnerQuery.graphql"
import {
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/primitives/Dialog"
import MutateGoalForm from "../goal/Mutate"
import { SeparatorHorizontal } from "../ui/Separator"
import {
  ArchiveIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons"
import style from "./Sidebar.module.css"
import IconButton from "../ui/icon/IconButton"
import { DropdownMenuItem } from "../ui/menu/DropdownMenu"
import LeftSidebarItemMenu from "./LeftSidebarItemMenu"

export default function LeftSidebar(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <LeftSidebarInner />
    </Suspense>
  )
}

function LeftSidebarInner(): JSX.Element {
  // should probably be preload query
  const data = useLazyLoadQuery<LeftSidebarInnerQuery>(
    graphql`
      query LeftSidebarInnerQuery {
        goal_connection(first: 100, order_by: { title: asc })
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

  const defaultConfig = { order_by: { title: "asc" } }

  const notes = []
  const goals = data.goal_connection.edges.map(edge => edge.node)
  const activities = []
  const todos = []

  return (
    <div>
      <LeftSidebarContent
        title="Notes"
        items={notes}
        targetConnection=""
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Todos"
        items={todos}
        targetConnection=""
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Goals"
        items={goals}
        targetConnection="LeftSidebarInnerQuery_goal_connection"
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Activities"
        items={activities}
        targetConnection=""
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
    </div>
  )
}

interface ContentProps {
  items: ContentItem[]
  title: string
  defaultMaxItems?: number
  targetConnection: string
  targetConnectionConfig: any
}

interface ContentItem {
  title: string
  id: string
}

function LeftSidebarContent(props: ContentProps): JSX.Element {
  const { items, title, defaultMaxItems = 7 } = props

  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [showAllItems, setShowAllItems] = React.useState<boolean>(false)

  const hasHiddenItems = items.length > defaultMaxItems && !showAllItems

  const filteredItems = hasHiddenItems ? items.slice(0, defaultMaxItems) : items

  return (
    <DialogRoot open={openDialog} onOpenChange={setOpenDialog}>
      <SidebarCollapsible title={title} iconComponent={<CollapsibleAddIcon />}>
        <div className="mb-1">
          {filteredItems.map(item => (
            <SidebarCollapsibleItem
              key={item.id}
              title={item.title}
              dropdownContent={
                <LeftSidebarItemMenu
                  item={item}
                  targetConnection={props.targetConnection}
                  targetConnectionConfig={props.targetConnectionConfig}
                />
              }></SidebarCollapsibleItem>
          ))}
          {hasHiddenItems && (
            <SidebarCollapsibleButton
              className="justify-center"
              onClick={() => setShowAllItems(!showAllItems)}>
              Show all
            </SidebarCollapsibleButton>
          )}
          {items.length === 0 && (
            <SidebarCollapsibleItem
              title="Nothing found."
              hideIcon
              pointer={false}
              dots={false}
            />
          )}
        </div>
      </SidebarCollapsible>
      <DialogContent>
        <DialogTitle>Add goal</DialogTitle>
        <SeparatorHorizontal className="mt-2 mb-1" />
        <MutateGoalForm
          onComplete={() => setOpenDialog(false)}
          onCancel={() => setOpenDialog(false)}
        />
      </DialogContent>
    </DialogRoot>
  )
}

function CollapsibleAddIcon(props: any): JSX.Element {
  return (
    <DialogTrigger onClick={event => event.stopPropagation()}>
      <PlusIcon width={20} height={20} className={style.addIcon} />
    </DialogTrigger>
  )
}
