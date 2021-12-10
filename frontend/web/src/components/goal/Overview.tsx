import {
  ChevronDownIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import React, { Suspense, useContext, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery, usePreloadedQuery } from "react-relay"
import { GOAL_OVERVIEW_CONNECTION } from "../../constants/connections"
import { useFilterStore } from "../../stores/filter"
import { DataLoaderContext } from "../DataLoader"
import { defaultGoalQuery } from "../DataLoader.gql"
import Badge from "../ui/Badge"
import { DropdownMenuRoot, DropdownMenuTrigger } from "../ui/menu/DropdownMenu"
import { DialogContent, DialogRoot, DialogTitle } from "../ui/primitives/Dialog"
import { SeparatorHorizontal } from "../ui/Separator"
import {
  DataLoaderInnerGoalQuery,
  DataLoaderInnerGoalQueryResponse,
} from "../__generated__/DataLoaderInnerGoalQuery.graphql"
import MutateGoal from "./Mutate"
import OverviewDropdownMenuContent from "./OverviewDropdownMenuContent"
import OverviewItem from "./OverviewItem"

type Item = DataLoaderInnerGoalQueryResponse["goal_connection"]["edges"][0]["node"]

export default function GoalOverview(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <OverviewGoalInner />
    </Suspense>
  )
}

function OverviewGoalInner(): JSX.Element {
  const [showArchived, setShowArchived] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [activeItem, setActiveItem] = useState<Item>()

  const { goalQueryRef } = useContext(DataLoaderContext)

  const data = usePreloadedQuery<DataLoaderInnerGoalQuery>(
    defaultGoalQuery,
    goalQueryRef
  )

  const items = data.goal_connection.edges
    .map(edge => edge.node)
    .filter(node => (showArchived ? node : !node.archived))

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
      <DialogRoot open={openDialog} onOpenChange={setOpenDialog}>
        <div className="flex flex-wrap gap-1">
          {items.map(item => (
            <OverviewItem<Item> item={item} setActiveItem={item => setActiveItem(item)} />
          ))}
        </div>
        <DialogContent>
          <DialogTitle>Mutate goal</DialogTitle>
          <SeparatorHorizontal className="mt-2 mb-1" />
          {activeItem && (
            <MutateGoal
              goal={activeItem}
              onComplete={() => setOpenDialog(false)}
              onCancel={() => setOpenDialog(false)}
            />
          )}
        </DialogContent>
      </DialogRoot>
    </div>
  )
}
