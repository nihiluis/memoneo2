import React from "react"

import Head from "next/head"
import { SITE_TITLE } from "../constants/env"
import Logo from "./ui/Logo"

export default function Loading() {
  return (
    <div className="container mx-auto">
      <header>
        <div className="mt-12 table mx-auto">
          <Logo width={36} height={36} />
          <p>Authenticating.</p>
        </div>
      </header>
      <main></main>
    </div>
  )
}
