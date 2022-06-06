import React, { useEffect, useState, useContext } from "react"

import GridLayout from "../../src/components/ui/layout/GridLayout"
import Auth from "../../src/components/Auth"
import { initEnvironment } from "../../src/relay/relay"
import RightSidebar from "../../src/components/sidebar/RightSidebar"
import LeftSidebar from "../../src/components/sidebar/left/LeftSidebar"
import DataLoader from "../../src/components/DataLoader"
import KeyLoader from "../../src/components/key/KeyLoader"
import NoteEditor from "../../src/components/object/note/NoteEditor"
import { useRouter } from "next/router"
import useNextQueryParam from "../../src/lib/next"

export default function Edit() {
  return (
    <Auth require>
      <DataLoader>
        <KeyLoader>
          <EditInner />
        </KeyLoader>
      </DataLoader>
    </Auth>
  )
}

function EditInner() {
  const [showSidebarLeft, setShowSidebarLeft] = useState<boolean>(false)
  const [showSidebarRight, setShowSidebarRight] = useState<boolean>(false)

  const [routerReady, setRouterReady] = useState(false)

  const router = useRouter()

  useEffect(() => {
    // just router.isReady does not work
    const hasId = window.location.href.split("edit/")[1].length > 0


    if (hasId && router.isReady && router.query.noteId) {
      setRouterReady(true)
      console.log("retrieving noteId param")
    }
  }, [router.isReady, router.query.noteId])

  let noteId: string | null = null
  if (router.query.noteId) {
    noteId =
      typeof router.query.noteId === "string"
        ? (router.query.noteId as string)
        : router.query.noteId[0]
  }

  return (
    <GridLayout
      showSidebarLeft={showSidebarLeft}
      setShowSidebarLeft={setShowSidebarLeft}
      showSidebarRight={showSidebarRight}
      setShowSidebarRight={setShowSidebarRight}
      sidebarLeftComponent={<LeftSidebar />}
      sidebarRightComponent={<RightSidebar />}>
      {routerReady && (
        <NoteEditor
          id={noteId}
          onCancel={() => router.push("/")}
          onComplete={() => router.push("/")}
        />
      )}
    </GridLayout>
  )
}

export async function getStaticProps() {
  initEnvironment()

  return { props: {} }
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { noteId: undefined } }],
    fallback: true,
  }
}
