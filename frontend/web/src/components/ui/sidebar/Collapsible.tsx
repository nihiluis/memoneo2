import {
  ChevronDownIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons"
import React, { PropsWithChildren, useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../Collapsible"
import { SeparatorHorizontal } from "../Separator"
import style from "./Collapsible.module.css"

interface ContainerProps extends PropsWithChildren<{}> {
  title: String
}

interface ItemProps {
  title: String
}

export function SidebarCollapsible(props: ContainerProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex gap-1 items-center bold text-lg">
        <div className={style.icon}>
          {open ? (
            <ChevronDownIcon color="var(--icon-color)" width={24} height={24} />
          ) : (
            <ChevronRightIcon
              color="var(--icon-color)"
              width={24}
              height={24}
            />
          )}
        </div>
        {props.title}
      </CollapsibleTrigger>
      <SeparatorHorizontal className="mx-auto mt-1 w-11/12 mb-1" />
      <CollapsibleContent>{props.children}</CollapsibleContent>
    </Collapsible>
  )
}

export function SidebarCollapsibleItem(props: ItemProps): JSX.Element {
  return (
    <div className="flex gap-1 items-center">
      <div className={style.icon}>
        <DotFilledIcon color="var(--icon-color)" width={24} height={24} />
      </div>
      <p>{props.title}</p>
    </div>
  )
}
