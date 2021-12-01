import * as React from "react"
import cx from "classnames"
import Head from "next/head"

import layoutStyle from "./Layout.module.css"

import { PRODUCT_NAME } from "../../../constants/env"
import Logo from "../Logo"
import Sidebar from "../Sidebar"
import { GearIcon, HamburgerMenuIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons"

interface Props {
  showSidebarLeft: boolean
  showSidebarRight: boolean
  setShowSidebarRight: (show: boolean) => void
  sidebarLeftComponent: JSX.Element
  sidebarRightComponent: JSX.Element
}

export default function GridLayout(props: React.PropsWithChildren<Props>) {
  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <div id={layoutStyle.gridLayout}>
        <header className={layoutStyle.headerGrid}>
          <div className="flex gap-3 items-center pl-8">
            <HamburgerMenuIcon color="var(--icon-color)" width={24} height={24} />
            <HomeIcon color="var(--icon-color)" width={24} height={24} />
          </div>
          <div></div>
          <div className="flex gap-3 items-center justify-end pr-8">
            <GearIcon color="var(--icon-color)" width={24} height={24} />
            <PersonIcon color="var(--icon-color)" width={24} height={24} />
          </div>
        </header>
        <Sidebar
          position="left"
          className={cx(layoutStyle.sidebarLeftGrid, {
            [layoutStyle.sidebarGridDisabled]: !props.showSidebarLeft,
          })}>
          {props.sidebarLeftComponent}
        </Sidebar>
        <main className={cx(layoutStyle.contentGrid)}>
          <div className={layoutStyle.content}>{props.children}</div>
        </main>
        <Sidebar
          position="right"
          className={cx(layoutStyle.sidebarRightGrid, {
            [layoutStyle.sidebarGridDisabled]: !props.showSidebarRight,
          })}>
          {props.sidebarRightComponent}
        </Sidebar>
      </div>
    </div>
  )
}
