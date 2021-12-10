import React from "react"
import Badge from "../ui/Badge"
import {
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/primitives/Dialog"
import { SeparatorHorizontal } from "../ui/Separator"
import MutateGoal from "./Mutate"

interface ItemPart {
  id: string
  title: string
}

export default function OverviewItem<Item extends ItemPart>(props: {
  item: Item
  setActiveItem(item: Item): void
}): JSX.Element {
  const { item, setActiveItem } = props

  return (
    <DialogTrigger
      onClick={event => {
        event.stopPropagation()
        setActiveItem(item)
      }}>
      <Badge key={item.id} title={item.title} />
    </DialogTrigger>
  )
}
