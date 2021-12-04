import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DotFilledIcon,
  DotsHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons"
import React, { PropsWithChildren, useState } from "react"
import { cx } from "../../../lib/reexports"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../Collapsible"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
} from "../menu/DropdownMenu"
import { SeparatorHorizontal } from "../Separator"
import style from "./Collapsible.module.css"

interface ContainerProps extends PropsWithChildren<{}> {
  title: string
}

interface ItemProps {
  title: string
  hideIcon?: boolean
  pointer?: boolean
  dots?: boolean
}

interface ButtonProps {
  title: string
  className?: string
}

export function SidebarCollapsible(props: ContainerProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Collapsible className={style.container} open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cx(
          style.trigger,
          "flex pb-1 gap-1 items-center font-bold text-lg rounded-t w-full"
        )}>
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
      <SeparatorHorizontal className="mx-auto w-11/12 mb-1" />
      <CollapsibleContent className={cx({ "pb-3": !!props.children })}>
        {props.children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function SidebarCollapsibleItem(props: ItemProps): JSX.Element {
  const pointer = props.pointer ?? true
  const dots = props.dots ?? true

  return (
    <div
      className={cx(style.item, "py-1 flex gap-1 items-center", {
        "cursor-pointer": pointer,
        [style.itemInteractive]: pointer,
      })}>
      <div className={cx(style.icon, { "opacity-0": props.hideIcon })}>
        <DotFilledIcon color="var(--icon-color)" width={24} height={24} />
      </div>
      <p>{props.title}</p>
      {dots && (
        <div className="flex justify-end flex-grow pr-2">
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <DotsHorizontalIcon
                className={style.dotsIcon}
                width={24}
                height={24}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuRoot>
        </div>
      )}
    </div>
  )
}

export function SidebarCollapsibleButton(props: ButtonProps): JSX.Element {
  return (
    <div className={cx(style.button, "flex gap-1 py-1 rounded w-full text-gray-600")}>
      <div className={style.buttonIcon}>
        <PlusIcon color="var(--icon-color)" width={24} height={24} />
      </div>
      {props.title}
    </div>
  )
}
