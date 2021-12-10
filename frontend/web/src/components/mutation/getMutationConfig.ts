import { UseMutationConfig } from "react-relay"
import { MutationParameters, PayloadError, VariablesOf } from "relay-runtime"

interface Config {
  setErrors(errors: PayloadError[]): void
  setLoading(loading: boolean): void
  onComplete(): void
}

export default function getMutationConfig<Mutation extends MutationParameters>(
  variables: VariablesOf<Mutation>,
  config: Config
): UseMutationConfig<Mutation> {
  const { setErrors, setLoading, onComplete } = config

  const mutationConfig: UseMutationConfig<Mutation> = {
    variables,
    onError: error => {
      console.error(error)
      setErrors([error])
      setLoading(false)
    },
    onCompleted: (_, errors) => {
      setLoading(false)
      setErrors(errors ?? [])

      if (errors && errors.length !== 0) {
        console.error("found errors " + JSON.stringify(errors))
        return
      }

      onComplete()
    },
  }

  return mutationConfig
}
