import { Formik } from "formik"
import React, { Suspense, useContext, useState } from "react"
import { useMutation } from "react-relay"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import { mutation } from "./ActivityMutate.gql"
import { getIdFromNodeId } from "../../lib/hasura"
import { PayloadError } from "relay-runtime"
import { AuthContext } from "../Auth"
import { useFilterStore } from "../../stores/filter"
import { DEFAULT_ACTIVITY_CONNECTION } from "../../constants/connections"
import { getRootConnectionIds } from "../../relay/getConnection"
import EditorFormWrapper from "../mutation/EditorFormWrapper"
import getMutationConfig from "../mutation/getMutationConfig"
import EditorHeader from "../mutation/EditorHeader"
import {
  ActivityMutateMutation,
  ActivityMutateMutationVariables,
} from "./__generated__/ActivityMutateMutation.graphql"
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
  activity?: { id: string; title: string; description: string }
  onComplete(): void
  onCancel(): void
}

export default function ActivityMutate(props: Props): JSX.Element {
  const [commit, _] = useMutation<ActivityMutateMutation>(mutation)
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { auth } = useContext(AuthContext)

  const { activity, onComplete, onCancel } = props

  const operationType = !!activity ? "edit" : "add"

  const defaultActivityFilters = useFilterStore(state =>
    state.getFilters(DEFAULT_ACTIVITY_CONNECTION)
  )

  function submit(values: FormValues) {
    const activityId = activity ? getIdFromNodeId(activity.id) : null

    setLoading(true)

    const variables: ActivityMutateMutationVariables = {
      id: activityId ?? uuidv4(),
      user_id: auth.userId,
      title: values["title"],
      description: values["description"],
      connections: [
        ...getRootConnectionIds(
          DEFAULT_ACTIVITY_CONNECTION,
          defaultActivityFilters
        ),
      ],
    }

    const mutationConfig = getMutationConfig<ActivityMutateMutation>(
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
      <EditorHeader operationType={operationType} objectType="activity" />
      <Formik<FormValues>
        initialValues={{
          title: activity?.title ?? "",
          description: activity?.description ?? "",
        }}
        validationSchema={FormSchema}
        onSubmit={submit}>
        {formikProps => (
          <EditorFormWrapper
            formikProps={formikProps}
            error={errors.length > 0 ? "error" : ""}
            onCancel={props.onCancel}
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
