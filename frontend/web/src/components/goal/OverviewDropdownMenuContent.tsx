import { ArchiveIcon } from "@radix-ui/react-icons"
import React from "react"
import { DropdownMenuContent, DropdownMenuItem } from "../ui/menu/DropdownMenu"

interface Props {
  showArchived: boolean
  setShowArchived(archived: boolean): void
}

export default function OverviewDropdownMenuContent(props: Props): JSX.Element {
  const { showArchived, setShowArchived } = props

  return (
    <DropdownMenuContent>
      <DropdownMenuItem
        className="flex gap-2"
        onClick={() => setShowArchived(!showArchived)}>
        <ArchiveIcon color="var(--icon-color)" />
        {showArchived ? "Hide" : "Show"} archived
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
