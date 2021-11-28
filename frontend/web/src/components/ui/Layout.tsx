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
        <header className="mb-4">
          <div className={layoutStyle.logoHeaderSimple}>
            <Logo width={36} height={36} className="mr-4" />
            <p className="font-semibold" style={{ lineHeight: "24px" }}>
              Log in to {PRODUCT_NAME}
            </p>
          </div>
        </header>
        <main>
          <div>{props.children}</div>
        </main>
      </div>
    </div>
  )
}
