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
import { MemoObjectType } from "../types"

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
              archived
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
        type="note"
        items={notes}
        targetConnection=""
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Todos"
        type="todo"
        items={todos}
        targetConnection=""
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Goals"
        type="goal"
        items={goals}
        targetConnection="LeftSidebarInnerQuery_goal_connection"
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Activities"
        type="activity"
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
  type: MemoObjectType
  targetConnection: string
  targetConnectionConfig: any
}

interface ContentItem {
  title: string
  archived: boolean
  id: string
}

function LeftSidebarContent(props: ContentProps): JSX.Element {
  const { items, type, title, defaultMaxItems = 7 } = props

  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [showAllItems, setShowAllItems] = React.useState<boolean>(false)

  const prefilteredItems = items.filter(item => !item.archived)
  const hasHiddenItems =
    prefilteredItems.length > defaultMaxItems && !showAllItems

  const filteredItems = hasHiddenItems
    ? prefilteredItems.slice(0, defaultMaxItems)
    : prefilteredItems

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
                  type={type}
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
