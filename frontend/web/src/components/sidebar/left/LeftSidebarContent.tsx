import { PlusIcon } from "@radix-ui/react-icons"
import React from "react"
import GoalMutate from "../../object/goal/GoalMutate"
import { MemoObjectType } from "../../types"
import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "../../ui/primitives/Dialog"
import {
  SidebarCollapsible,
  SidebarCollapsibleButton,
  SidebarCollapsibleItem,
} from "../../ui/sidebar/Collapsible"
import LeftSidebarItemMenuGoal from "./LeftSidebarItemMenuGoal"
import ActivityMutate from "../../object/activity/ActivityMutate"
import TodoMutate from "../../object/todo/TodoMutate"
import NoteEditor from "../../object/note/NoteEditor"
import LeftSidebarItemMenu from "./LeftSidebarItemMenu"

interface ContentProps {
  items: ContentItem[]
  title: string
  defaultMaxItems?: number
  type: MemoObjectType
  showArchived: boolean
}

interface ContentItem {
  title: string
  archived: boolean
  id: string
}

export default function LeftSidebarContent(props: ContentProps): JSX.Element {
  const { items, type, title, defaultMaxItems = 7, showArchived } = props

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
    <SidebarCollapsible
      title={title}
      iconComponent={<CollapsibleMenu type={type} />}>
      <div className="mb-1">
        {filteredItems.map(item => (
          <SidebarCollapsibleItem
            key={item.id}
            title={item.title}
            dropdownContent={
              <LeftSidebarItemMenu item={item} type={type} />
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
  )
}

function CollapsibleMenu(props: { type: MemoObjectType }): JSX.Element {
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)

  return (
    <React.Fragment>
      <DialogRoot open={openDialog} onOpenChange={setOpenDialog}>
        <CollapsibleAddIcon />
        <DialogContent onClick={event => event.stopPropagation()}>
          <CollapsibleMenuDialogContent
            type={props.type}
            setOpenDialog={setOpenDialog}
          />
        </DialogContent>
      </DialogRoot>
    </React.Fragment>
  )
}

function CollapsibleMenuDialogContent(props: {
  type: MemoObjectType
  setOpenDialog: (open: boolean) => void
}) {
  const { type, setOpenDialog } = props

  switch (type) {
    case "activity":
      return (
        <ActivityMutate
          onComplete={() => setOpenDialog(false)}
          onCancel={() => setOpenDialog(false)}
        />
      )
    case "goal":
      return (
        <GoalMutate
          onComplete={() => setOpenDialog(false)}
          onCancel={() => setOpenDialog(false)}
        />
      )
    case "todo":
      return (
        <TodoMutate
          onComplete={() => setOpenDialog(false)}
          onCancel={() => setOpenDialog(false)}
        />
      )
    case "note":
      return (
        <NoteEditor
          onComplete={() => setOpenDialog(false)}
          onCancel={() => setOpenDialog(false)}
        />
      )
    default:
      return null
  }
}

function CollapsibleAddIcon(): JSX.Element {
  return (
    <DialogTrigger onClick={event => event.stopPropagation()}>
      <PlusIcon width={20} height={20} className="icon-bg icon-20" />
    </DialogTrigger>
  )
}
