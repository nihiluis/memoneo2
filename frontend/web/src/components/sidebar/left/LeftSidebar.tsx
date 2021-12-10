import React, { Suspense, useContext, useEffect, useState } from "react"
import {
  SidebarCollapsible,
  SidebarCollapsibleButton,
  SidebarCollapsibleItem,
} from "../../ui/sidebar/Collapsible"
import { graphql, useLazyLoadQuery, usePreloadedQuery } from "react-relay"
import { LeftSidebarInnerQuery } from "../__generated__/LeftSidebarInnerQuery.graphql"
import {
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../ui/primitives/Dialog"
import MutateGoalForm from "../../goal/Mutate"
import { SeparatorHorizontal } from "../../ui/Separator"
import {
  ArchiveIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons"
import style from "./Sidebar.module.css"
import IconButton from "../../ui/icon/IconButton"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "../../ui/menu/DropdownMenu"
import LeftSidebarItemMenu from "./LeftSidebarItemMenu"
import { MemoObjectType } from "../../types"
import { DataLoaderContext } from "../../DataLoader"
import { DataLoaderInnerGoalQuery } from "../../__generated__/DataLoaderInnerGoalQuery.graphql"
import { defaultGoalQuery } from "../../DataLoader.gql"
import { DEFAULT_GOAL_CONNECTION } from "../../../constants/connections"
import LeftSidebarContent from "./LeftSidebarContent"
import LeftSidebarHeader from "./LeftSidebarHeader"

export default function LeftSidebar(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <LeftSidebarInner />
    </Suspense>
  )
}

function LeftSidebarInner(): JSX.Element {
  const [showArchived, setShowArchived] = useState(false)
  const { goalQueryRef } = useContext(DataLoaderContext)

  const goalsData = usePreloadedQuery<DataLoaderInnerGoalQuery>(
    defaultGoalQuery,
    goalQueryRef
  )

  const defaultConfig = {}

  const notes = []
  const goals = goalsData.goal_connection.edges
    .map(edge => edge.node)
  const activities = []
  const todos = []

  return (
    <div>
      <LeftSidebarHeader
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />
      <LeftSidebarContent
        title="Notes"
        type="note"
        items={notes}
        showArchived={showArchived}
        targetConnection=""
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Todos"
        type="todo"
        items={todos}
        showArchived={showArchived}
        targetConnection=""
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Goals"
        type="goal"
        items={goals}
        showArchived={showArchived}
        targetConnection={DEFAULT_GOAL_CONNECTION}
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
      <LeftSidebarContent
        title="Activities"
        type="activity"
        showArchived={showArchived}
        items={activities}
        targetConnection=""
        targetConnectionConfig={defaultConfig}></LeftSidebarContent>
    </div>
  )
}
