import { PlusIcon } from "@radix-ui/react-icons"
import React from "react"
import MutateGoalForm from "../../goal/Mutate"
import { MemoObjectType } from "../../types"
import {
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../ui/primitives/Dialog"
import { SeparatorHorizontal } from "../../ui/Separator"
import {
  SidebarCollapsible,
  SidebarCollapsibleButton,
  SidebarCollapsibleItem,
} from "../../ui/sidebar/Collapsible"
import LeftSidebarItemMenu from "./LeftSidebarItemMenu"
import style from "./LeftSidebar.module.css"

interface ContentProps {
  items: ContentItem[]
  title: string
  defaultMaxItems?: number
  type: MemoObjectType
  showArchived: boolean
  targetConnection: string
  targetConnectionConfig: any
}

interface ContentItem {
  title: string
  archived: boolean
  id: string
}

export default function LeftSidebarContent(props: ContentProps): JSX.Element {
  const { items, type, title, defaultMaxItems = 7, showArchived } = props

  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [showAllItems, setShowAllItems] = React.useState<boolean>(false)

  const prefilteredItems = items.filter(item =>
    showArchived ? item : !item.archived
  )
  const hasHiddenItems =
    prefilteredItems.length > defaultMaxItems && !showAllItems

  const filteredItems = hasHiddenItems
    ? prefilteredItems.slice(0, defaultMaxItems)
    : prefilteredItems

  return (
    <DialogRoot open={openDialog} onOpenChange={setOpenDialog}>
      <SidebarCollapsible title={title} iconComponent={<CollapsibleItems />}>
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

function CollapsibleItems(): JSX.Element {
  return (
    <React.Fragment>
      <CollapsibleAddIcon />
    </React.Fragment>
  )
}

function CollapsibleAddIcon(): JSX.Element {
  return (
    <DialogTrigger onClick={event => event.stopPropagation()}>
      <PlusIcon width={20} height={20} className="icon-bg icon-20" />
    </DialogTrigger>
  )
}
