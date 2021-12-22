import React, { PropsWithChildren } from "react"
import { useKeyStore } from "../../stores/key"

export default function RequireKey(props: PropsWithChildren<{}>): JSX.Element {
  const key = useKeyStore(state => state.key)

  return (
    <React.Fragment>
      {key && props.children}
      {!key && <p className="error">Unable to find key.</p>}
    </React.Fragment>
  )
}
