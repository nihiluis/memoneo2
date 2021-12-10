import { Formik } from "formik"
import React, { Suspense, useContext, useState } from "react"
import { ConnectionHandler, useMutation, UseMutationConfig } from "react-relay"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import FormRow from "../ui/form/FormRow"
import { mutation } from "./Mutate.gql"
import { getIdFromNodeId } from "../../lib/hasura"
import { PayloadError, ROOT_ID } from "relay-runtime"
import {
  MutateGoalFormMutation,
  MutateGoalFormMutationVariables,
} from "./__generated__/MutateGoalFormMutation.graphql"
import { AuthContext } from "../Auth"
import { useFilterStore } from "../../stores/filter"
import {
  DEFAULT_GOAL_CONNECTION,
} from "../../constants/connections"
import { getRootConnectionIds } from "../../relay/getConnection"
import MutationFormWrapper from "../mutation/MutationFormWrapper"
import getMutationConfig from "../mutation/getMutationConfig"

interface FormValues {
  title: string
  description: string
}

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too short.")
    .max(32, "Too long.")
    .required("Required."),
  description: Yup.string(),
})

interface Props {
  goal?: { id: string; title: string; description: string }
  onComplete(): void
  onCancel(): void
}

export default function MutateGoal(props: Props): JSX.Element {
  const [commit, _] = useMutation<MutateGoalFormMutation>(mutation)
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { auth } = useContext(AuthContext)

  const { goal, onComplete, onCancel } = props

  const type = !!goal ? "edit" : "add"

  const defaultGoalFilters = useFilterStore(state =>
    state.getFilters(DEFAULT_GOAL_CONNECTION)
  )

  function submit(values: FormValues) {
    const goalId = goal ? getIdFromNodeId(goal.id) : null

    setLoading(true)

    const variables: MutateGoalFormMutationVariables = {
      id: goalId ?? uuidv4(),
      user_id: auth.userId,
      title: values["title"],
      description: values["description"],
      connections: [
        ...getRootConnectionIds(DEFAULT_GOAL_CONNECTION, defaultGoalFilters),
      ],
    }

    const mutationConfig = getMutationConfig<MutateGoalFormMutation>(
      variables,
      {
        setErrors,
        setLoading,
        onComplete,
      }
    )

    commit(mutationConfig)
  }

  return (
    <Suspense fallback={null}>
      <Formik<FormValues>
        initialValues={{
          title: goal?.title ?? "",
          description: goal?.description ?? "",
        }}
        validationSchema={FormSchema}
        onSubmit={submit}>
        {formikProps => (
          <MutationFormWrapper
            formikProps={formikProps}
            error={errors.length > 0 ? "error" : ""}
            onCancel={props.onCancel}
            type={type}
            loading={loading}>
            <FormRow
              inputClassName="bg-gray-50 border border-gray-200"
              {...formikProps}
              type="text"
              name="title"
              label="Title"
            />
            <FormRow
              inputClassName="bg-gray-50 border border-gray-200"
              {...formikProps}
              type="text"
              name="description"
              label="Description"
            />
          </MutationFormWrapper>
        )}
      </Formik>
    </Suspense>
  )
}
