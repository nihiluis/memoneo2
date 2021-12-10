import { ArchiveIcon, GearIcon } from "@radix-ui/react-icons"
import React from "react"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "../../ui/menu/DropdownMenu"

interface Props {
  showArchived: boolean
  setShowArchived(showArchived: boolean): void
}

export default function LeftSidebarHeader(props: Props): JSX.Element {
  const { showArchived, setShowArchived } = props

  return (
    <div>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <GearIcon width={20} height={20} className="icon-bg icon-20" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => setShowArchived(!showArchived)}>
            <ArchiveIcon color="var(--icon-color)" />
            {showArchived ? "Hide" : "Show"} archived
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </div>
  )
}
