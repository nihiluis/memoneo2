import * as React from "react"
import cx from "classnames"
import Head from "next/head"

import layoutStyle from "./Layout.module.css"

import { PRODUCT_NAME } from "../../../constants/env"
import Logo from "../Logo"
import Sidebar from "../sidebar"
import {
  GearIcon,
  HamburgerMenuIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons"
import * as Avatar from "@radix-ui/react-avatar"
import { useRouter } from "next/router"
import IconButton from "../icon/IconButton"
import MiniAvatar from "../avatar/MiniAvatar"
import MiniSearch from "../search/MiniSearch"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "../menu/DropdownMenu"

interface Props {
  showSidebarLeft: boolean
  showSidebarRight: boolean
  setShowSidebarRight: (show: boolean) => void
  setShowSidebarLeft: (show: boolean) => void
  sidebarLeftComponent: JSX.Element
  sidebarRightComponent: JSX.Element
}

export default function GridLayout(props: React.PropsWithChildren<Props>) {
  const { showSidebarLeft, setShowSidebarLeft } = props

  const router = useRouter()

  function logout() {
    router.push("logout")
  }

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
            <IconButton>
              <HamburgerMenuIcon
                className="icon"
                color="var(--icon-color)"
                width={24}
                height={24}
                onClick={() => setShowSidebarLeft(!showSidebarLeft)}
              />
            </IconButton>
            <IconButton>
              <HomeIcon
                className="icon"
                color="var(--icon-color)"
                width={24}
                height={24}
                onClick={() => router.push("/")}
              />
            </IconButton>
          </div>
          <div className={cx(layoutStyle.contentPaddingLeft, "flex")}>
          </div>
          <div className="flex gap-3 items-center justify-end pr-8">
            <IconButton>
              <GearIcon color="var(--icon-color)" width={24} height={24} />
            </IconButton>
            <DropdownMenuRoot>
              <DropdownMenuTrigger>
                <MiniAvatar />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <a onClick={logout}>Logout</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuRoot>
          </div>
        </header>
        <Sidebar
          position="left"
          className={cx(layoutStyle.sidebarLeftGrid, {
            [layoutStyle.sidebarGridDisabled]: !props.showSidebarLeft,
          })}>
          {props.sidebarLeftComponent}
        </Sidebar>
        <main
          className={cx(layoutStyle.contentGrid, {
            [layoutStyle.contentGridLeftSidebar]: props.showSidebarLeft,
          })}>
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
