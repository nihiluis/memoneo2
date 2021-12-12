import { Formik } from "formik"
import React, { Suspense, useContext, useState } from "react"
import { useMutation } from "react-relay"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import { mutation } from "./GoalMutate.gql"
import { getIdFromNodeId } from "../../lib/hasura"
import { PayloadError } from "relay-runtime"
import { AuthContext } from "../Auth"
import { useFilterStore } from "../../stores/filter"
import { DEFAULT_GOAL_CONNECTION } from "../../constants/connections"
import { getRootConnectionIds } from "../../relay/getConnection"
import EditorFormWrapper from "../mutation/EditorFormWrapper"
import getMutationConfig from "../mutation/getMutationConfig"
import EditorHeader from "../mutation/EditorHeader"

import {
  GoalMutateMutation,
  GoalMutateMutationVariables,
} from "./__generated__/GoalMutateMutation.graphql"
import EditorFormRowText from "../mutation/EditorFormRowText"

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

export default function GoalMutate(props: Props): JSX.Element {
  const [commit, _] = useMutation<GoalMutateMutation>(mutation)
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { auth } = useContext(AuthContext)

  const { goal, onComplete, onCancel } = props

  const operationType = !!goal ? "edit" : "add"

  const defaultGoalFilters = useFilterStore(state =>
    state.getFilters(DEFAULT_GOAL_CONNECTION)
  )

  function submit(values: FormValues) {
    const goalId = goal ? getIdFromNodeId(goal.id) : null

    setLoading(true)

    const variables: GoalMutateMutationVariables = {
      id: goalId ?? uuidv4(),
      user_id: auth.userId,
      title: values["title"],
      description: values["description"],
      connections: [
        ...getRootConnectionIds(DEFAULT_GOAL_CONNECTION, defaultGoalFilters),
      ],
    }

    const mutationConfig = getMutationConfig<GoalMutateMutation>(variables, {
      setErrors,
      setLoading,
      onComplete,
    })

    commit(mutationConfig)
  }

  return (
    <Suspense fallback={null}>
      <EditorHeader operationType={operationType} objectType="goal" />
      <Formik<FormValues>
        initialValues={{
          title: goal?.title ?? "",
          description: goal?.description ?? "",
        }}
        validationSchema={FormSchema}
        onSubmit={submit}>
        {formikProps => (
          <EditorFormWrapper
            formikProps={formikProps}
            error={errors.length > 0 ? "error" : ""}
            onCancel={onCancel}
            type={operationType}
            loading={loading}>
            <EditorFormRowText
              {...formikProps}
              type="text"
              name="title"
              label="Title"
            />
            <EditorFormRowText
              {...formikProps}
              type="text"
              name="description"
              label="Description"
            />
          </EditorFormWrapper>
        )}
      </Formik>
    </Suspense>
  )
}
