import React from "react"
import { cx } from "../../../lib/reexports"

import style from "./MiniSearch.module.css"

interface Props {
  className?: string
}

export default function MiniSearch(props: Props): JSX.Element {
  return (
    <div className={cx(style.miniSearch, props.className)}>
      <input placeholder="Search..." />
    </div>
  )
}
