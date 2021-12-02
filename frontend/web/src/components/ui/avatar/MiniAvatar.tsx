import React from "react"
import * as Avatar from "@radix-ui/react-avatar"

import style from "./MiniAvatar.module.css"

export default function MiniAvatar() {
  return (
    <Avatar.Root className={style.root}>
      <Avatar.Fallback className={style.fallback}>TT</Avatar.Fallback>
    </Avatar.Root>
  )
}
