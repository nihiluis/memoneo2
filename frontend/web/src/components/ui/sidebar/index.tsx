import * as React from "react"
import cx from "classnames"

import sidebarStyle from "./Sidebar.module.css"
import { SeparatorHorizontal } from "../Separator"

interface Props {
  position: "right" | "left"
  className?: string
}

class Sidebar extends React.Component<Props, {}> {
  render(): JSX.Element {
    const { position, children, className } = this.props

    const asideClasses = cx(sidebarStyle.sidebar, className, {
      [sidebarStyle.sidebarRight]: position === "right",
      [sidebarStyle.sidebarLeft]: position === "left",
    })

    return (
      <aside className={cx("p-2 pl-8 overflow-y-auto", asideClasses)}>
        <div className={sidebarStyle.sidebarInner}>{children}</div>
      </aside>
    )
  }
}

export const SidebarTitle: React.FunctionComponent = props => (
  <div>
    <h2 className="text-xl font-semibold">{props.children}</h2>
    <SeparatorHorizontal className="mt-1" />
  </div>
)

export const SidebarCategory: React.FunctionComponent = props => (
  <div className="py-2">{props.children}</div>
)

export default Sidebar
