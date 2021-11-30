import * as React from "react"
import cx from "classnames"
import Head from "next/head"

import layoutStyle from "./Layout.module.css"

import { PRODUCT_NAME } from "../../constants/env"
import Logo from "./Logo"
import Sidebar from "./Sidebar"

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
          <div className={layoutStyle.logoHeader}>
            <Logo width={36} height={36} />
            <p className="font-semibold" style={{ lineHeight: "24px" }}>
              {PRODUCT_NAME}
            </p>
          </div>
          <div></div>
          <div>burger</div>
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
