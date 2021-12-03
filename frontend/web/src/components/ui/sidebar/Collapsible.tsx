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
import { SeparatorHorizontal } from "../Separator"
import style from "./Collapsible.module.css"

interface ContainerProps extends PropsWithChildren<{}> {
  title: string
}

interface ItemProps {
  title: string
  hideIcon?: boolean
  pointer?: boolean
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
      <div className="flex justify-end flex-grow pr-2">
        <DotsHorizontalIcon color="var(--icon-color)" width={24} height={24} />
      </div>
    </div>
  )
}

export function SidebarCollapsibleButton(props: ButtonProps): JSX.Element {
  return (
    <div className={cx(style.button, "flex gap-1 py-1 rounded text-gray-600")}>
      <div className={style.buttonIcon}>
        <PlusIcon color="var(--icon-color)" width={24} height={24} />
      </div>
      {props.title}
    </div>
  )
}
