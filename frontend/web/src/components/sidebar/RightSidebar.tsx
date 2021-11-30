import React, { Suspense, useEffect } from "react"
import { SidebarCategory, SidebarTitle } from "../ui/Sidebar"
import MiniBadge from "../ui/MiniBadge"
import Link from "next/link"

import * as rightSidebarStyle from "./RightSidebar.module.css"
import { cx } from "../../lib/reexports"

export default function RightSidebarWrapper(): JSX.Element {
  return <RightSidebar />
}

function RightSidebar(): JSX.Element {
  return (
    <React.Fragment>
      <div className="mb-4" />
      <SidebarTitle>Actions</SidebarTitle>
      <SidebarCategory>
        <Link href="/document/new">
          <a>Create Document</a>
        </Link>
      </SidebarCategory>
    </React.Fragment>
  )
}
