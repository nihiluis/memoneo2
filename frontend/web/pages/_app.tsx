import "../styles/globals.css"
import "../styles/vars.css"
import "../styles/selectsearch.css"

import { ReactRelayContext } from "react-relay"

import { AuthContext } from "../src/components/Auth"
import { useState, useContext } from "react"

import { AuthState } from "../src/components/Auth"
import Head from "next/head"
import { IS_SERVER, PRODUCT_NAME } from "../src/constants/env"
import { RelayEnvironmentProvider } from "react-relay/hooks"
import { useEnvironment } from "../src/relay/relay"

function InventoryApp({ Component, pageProps }) {
  const environment = useEnvironment()

  const [auth, setAuth] = useState<AuthState>({
    authenticated: false,
    error: "",
    token: "",
    userId: "",
  })

  const authContextValue = { auth, setAuth }

  return (
    <RelayEnvironmentProvider environment={environment}>
      <AuthContext.Provider value={authContextValue}>
        <Head>
          <title>{PRODUCT_NAME}</title>
        </Head>
        <Component {...pageProps} />
      </AuthContext.Provider>
    </RelayEnvironmentProvider>
  )
}

export default InventoryApp
