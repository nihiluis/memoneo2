import React, { useContext, useEffect } from "react"
import dynamic from "next/dynamic"
import Auth, { AuthContext } from "../src/components/Auth"
import { logout } from "../src/lib/auth"
import { useKeyStore } from "../src/stores/key"
import { useRouter } from "next/router"

function Logout() {
  return (
    <Auth require={false}>
      <LogoutInner />
    </Auth>
  )
}

export default dynamic(() => Promise.resolve(Logout), { ssr: false })

function LogoutInner(): JSX.Element {
  const router = useRouter()

  const authContext = useContext(AuthContext)

  const setKey = useKeyStore(state => state.set)

  useEffect(() => {
    authContext!.setAuth({
      authenticated: false,
      token: "",
      error: "",
      userId: "",
    })
    setKey({ protectedKey: "", salt: "", key: undefined, error: "" })

    async function fetch() {
      await logout()

      router.push("login")
    }

    fetch()
  }, [])

  return <p>Logging out...</p>
}
