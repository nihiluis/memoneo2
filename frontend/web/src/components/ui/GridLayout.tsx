import * as React from "react"
import cx from "classnames"
import Head from "next/head"

import layoutStyle from "./Layout.module.css"

import { PRODUCT_NAME } from "../../constants/env"
import Logo from "./Logo"

interface Props {}

export default function GridLayout(props: React.PropsWithChildren<Props>) {
  const test: any = {}

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
        </header>
      </div>
      <main>
        <div className={layoutStyle.content}>{props.children}</div>
      </main>
    </div>
  )
}
