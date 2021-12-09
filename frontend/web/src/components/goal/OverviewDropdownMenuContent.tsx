import { ArchiveIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { graphql, useMutation, UseMutationConfig } from "react-relay"
import { PayloadError } from "relay-runtime"
import { getIdFromNodeId } from "../../lib/hasura"
import deleteInConnection from "../../relay/deleteInConnection"
import { MemoObjectType } from "../types"
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
