import React, { useEffect, useState, useContext } from "react"

import GridLayout from "../src/components/ui/layout/GridLayout"
import Auth from "../src/components/Auth"
import { initEnvironment } from "../src/relay/relay"
import GoalOverview from "../src/components/goal/GoalOverview"
import RightSidebar from "../src/components/sidebar/RightSidebar"

export default function Index() {
  return (
    <Auth require>
      <IndexInner />
    </Auth>
  )
}

function IndexInner() {
  const [showSidebarRight, setShowSidebarRight] = useState<boolean>(false)

  return (
    <GridLayout
      showSidebarLeft={false}
      showSidebarRight={showSidebarRight}
      setShowSidebarRight={setShowSidebarRight}
      sidebarLeftComponent={null}
      sidebarRightComponent={<RightSidebar />}>
      <GoalOverview />
    </GridLayout>
  )
}

export async function getStaticProps() {
  initEnvironment()

  return { props: {} }
}
