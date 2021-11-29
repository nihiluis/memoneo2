import * as React from "react"
import cx from "classnames"
import Head from "next/head"

import layoutStyle from "./Layout.module.css"

import { PRODUCT_NAME } from "../../constants/env"
import Logo from "./Logo"

interface Props {}

export default function Layout(props: React.PropsWithChildren<Props>) {
  const test: any = {}

  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <div id={layoutStyle.layout}>
        <main>
          <div>{props.children}</div>
        </main>
      </div>
    </div>
  )
}
