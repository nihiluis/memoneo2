import React from "react"
const { Suspense } = React

//import { getQueryRecordsFromEnvironment, getOperationFromQuery } from "./utils"

interface ComposedComponentProps {}

function withRelay<T extends ComposedComponentProps>(
  // dirty fix
  ComposedComponent: any
) {
  const WithRelay = (props: T) => {
    return (
      <Suspense fallback={"Loading..."}>
        <ComposedComponent {...props} />
      </Suspense>
    )
  }

  return WithRelay
}

export default withRelay
