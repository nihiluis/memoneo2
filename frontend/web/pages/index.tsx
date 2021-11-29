import React, { useEffect, useState, useContext } from "react"

import Layout from "../src/components/ui/GridLayout"
import Auth from "../src/components/Auth"
import { initEnvironment } from "../src/relay/relay"
import GoalOverview from "../src/components/goal/GoalOverview"

export default function Index() {
  return (
    <Auth require>
      <IndexInner />
    </Auth>
  )
}

function IndexInner() {
  return (
    <Layout>
      <GoalOverview />
    </Layout>
  )
}

export async function getStaticProps() {
  initEnvironment()

  return { props: {} }
}
