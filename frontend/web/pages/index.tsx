import React, { useEffect, useState, useContext } from "react"

import GridLayout from "../src/components/ui/layout/GridLayout"
import Auth from "../src/components/Auth"
import { initEnvironment } from "../src/relay/relay"
import GoalOverview from "../src/components/goal/GoalOverview"
import RightSidebar from "../src/components/sidebar/RightSidebar"
import LeftSidebar from "../src/components/sidebar/left/LeftSidebar"
import DataLoader from "../src/components/DataLoader"
import TodoOverview from "../src/components/todo/TodoOverview"
import ActivityOverview from "../src/components/activity/ActivityOverview"
import NoteCalendarOverview from "../src/components/note/NoteCalendarOverview"

export default function Index() {
  return (
    <Auth require>
      <DataLoader>
        <IndexInner />
      </DataLoader>
    </Auth>
  )
}

function IndexInner() {
  const [showSidebarLeft, setShowSidebarLeft] = useState<boolean>(false)
  const [showSidebarRight, setShowSidebarRight] = useState<boolean>(false)

  return (
    <GridLayout
      showSidebarLeft={showSidebarLeft}
      setShowSidebarLeft={setShowSidebarLeft}
      showSidebarRight={showSidebarRight}
      setShowSidebarRight={setShowSidebarRight}
      sidebarLeftComponent={<LeftSidebar />}
      sidebarRightComponent={<RightSidebar />}>
      <div className="flex gap-10">
        <div className="flex">
          <NoteCalendarOverview />
        </div>
        <div className="">
          <GoalOverview className="mb-8" />
          <TodoOverview className="mb-8" />
          <ActivityOverview />
        </div>
      </div>
    </GridLayout>
  )
}

export async function getStaticProps() {
  initEnvironment()

  return { props: {} }
}
