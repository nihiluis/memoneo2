import React from "react"

import Head from "next/head"
import { SITE_TITLE } from "../constants/env"
import * as Logo from "../../public/logo.svg"

export default function Loading() {
  return (
    <div className="container mx-auto">
      <header>
        <div className="mt-12 table mx-auto">
          <Logo style={{ width: 24, height: 24 }} />
          <p>Authenticating.</p>
        </div>
      </header>
      <main></main>
    </div>
  )
}
