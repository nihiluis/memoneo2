import React, { useState } from "react"
import Badge from "../ui/Badge"
import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "../ui/primitives/Dialog"
import TodoMutate from "./TodoMutate"

interface ItemPart {
  id: string
  title: string
}

export default function TodoOverviewItem<Item extends ItemPart>(props: {
  item: Item
}): JSX.Element {
  const { item } = props
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <DialogRoot
      key={`mutate-dialog-${item.id}`}
      open={openDialog}
      onOpenChange={setOpenDialog}>
      <DialogTrigger
        onClick={event => {
          event.stopPropagation()
        }}>
        <Badge key={item.id} title={item.title} />
      </DialogTrigger>
      <DialogContent>
        <TodoMutate
          todo={item as any}
          onComplete={() => setOpenDialog(false)}
          onCancel={() => setOpenDialog(false)}
        />
      </DialogContent>
    </DialogRoot>
  )
}
