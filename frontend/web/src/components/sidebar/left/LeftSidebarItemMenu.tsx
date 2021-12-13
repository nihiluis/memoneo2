import React, { useState } from "react"
import { PayloadError } from "relay-runtime"
import { MemoObjectType } from "../../types"
import LeftSidebarItemMenuActivity from "./LeftSidebarItemMenuActivity"
import LeftSidebarItemMenuGoal from "./LeftSidebarItemMenuGoal"
import LeftSidebarItemMenuNote from "./LeftSidebarItemMenuNote"
import LeftSidebarItemMenuTodo from "./LeftSidebarItemMenuTodo"

interface Props {
  item: { id: string; archived: boolean }
  type: MemoObjectType
}

export default function LeftSidebarItemMenu(props: Props): JSX.Element {
  const [openDialog, setOpenDialog] = useState(false)
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { type, item } = props

  switch (type) {
    case "goal":
      return (
        <LeftSidebarItemMenuGoal
          item={item}
          type={type}
          errors={errors}
          setErrors={setErrors}
          loading={loading}
          setLoading={setLoading}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )
    case "todo":
      return (
        <LeftSidebarItemMenuTodo
          item={item}
          type={type}
          errors={errors}
          setErrors={setErrors}
          loading={loading}
          setLoading={setLoading}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )
    case "note":
      return (
        <LeftSidebarItemMenuNote
          item={item}
          type={type}
          errors={errors}
          setErrors={setErrors}
          loading={loading}
          setLoading={setLoading}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )
    case "activity":
      return (
        <LeftSidebarItemMenuActivity
          item={item}
          type={type}
          errors={errors}
          setErrors={setErrors}
          loading={loading}
          setLoading={setLoading}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )
    default:
      return null
  }
}
