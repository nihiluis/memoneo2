import { UseMutationConfig } from "react-relay"
import {
  MutationParameters,
  PayloadError,
  SelectorStoreUpdater,
  VariablesOf,
} from "relay-runtime"

interface Config<Mutation extends MutationParameters> {
  setErrors(errors: PayloadError[]): void
  setLoading(loading: boolean): void
  onComplete?: (response: Mutation["response"]) => void

  updater?: SelectorStoreUpdater<Mutation["response"]>
  optimisticUpdater?: SelectorStoreUpdater<Mutation["response"]>
}

export default function getMutationConfig<Mutation extends MutationParameters>(
  variables: VariablesOf<Mutation>,
  config: Config<Mutation>
): UseMutationConfig<Mutation> {
  const {
    setErrors,
    setLoading,
    onComplete,
    optimisticUpdater,
    updater,
  } = config

  const mutationConfig: UseMutationConfig<Mutation> = {
    variables,
    onError: error => {
      console.error(error)

      setErrors([error])
      setLoading(false)
    },
    onCompleted: (response, errors) => {
      setLoading(false)
      setErrors(errors ?? [])

      if (errors && errors.length !== 0) {
        console.error("found errors " + JSON.stringify(errors))
        return
      }

      if (onComplete) {
        onComplete(response)
      }
    },
    optimisticUpdater,
    updater,
  }

  return mutationConfig
}
