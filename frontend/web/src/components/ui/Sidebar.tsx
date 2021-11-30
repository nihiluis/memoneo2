import * as React from "react"
import cx from "classnames"

import sidebarStyle from "./Sidebar.module.css"
import Line from "./Line"

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
      <aside className={asideClasses}>
        <div className={sidebarStyle.sidebarInner}>{children}</div>
      </aside>
    )
  }
}

export const SidebarTitle: React.FunctionComponent = props => (
  <div>
    <h2 className="text-xl font-semibold ml-4">{props.children}</h2>
    <Line className="ml-4 mt-1 w-3/4" />
  </div>
)

export const SidebarCategory: React.FunctionComponent = props => (
  <div className="py-2 px-4">{props.children}</div>
)

export default Sidebar
