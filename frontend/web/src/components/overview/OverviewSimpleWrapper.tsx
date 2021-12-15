import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import React, { PropsWithChildren, useState } from "react"
import { cx } from "../../lib/reexports"
import { DropdownMenuRoot, DropdownMenuTrigger } from "../ui/menu/DropdownMenu"
import OverviewDropdownMenuContent from "./DropdownMenuContent"

interface Props extends PropsWithChildren<{}> {
  title: string
  showArchived: boolean
  setShowArchived: (showArchived: boolean) => void
  className?: string
}

export default function OverviewSimpleWrapper(props: Props): JSX.Element {
  const { title, showArchived, setShowArchived, className, children } = props

  return (
    <div className={cx("bg-content", className)}>
      <div className="flex items-center gap-4 mb-4">
        <h2 className="leading-none">{title}</h2>
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
      {children}
    </div>
  )
}
