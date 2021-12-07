import { Formik } from "formik"
import React, { Suspense, useContext, useState } from "react"
import { ConnectionHandler, useMutation, UseMutationConfig } from "react-relay"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import FormRow from "../ui/form/FormRow"
import { mutation } from "./Mutate.gql"
import { getIdFromNodeId } from "../../lib/hasura"
import updateLocalConnection from "../../relay/updateLocalConnection"
import { PayloadError, ROOT_ID } from "relay-runtime"
import { MutateGoalFormMutation } from "./__generated__/MutateGoalFormMutation.graphql"
import { AuthContext } from "../Auth"

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

export default function MutateGoalForm(props: Props): JSX.Element {
  const [commit, _] = useMutation<MutateGoalFormMutation>(mutation)
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { auth } = useContext(AuthContext)

  function submit(values: FormValues) {
    const goalId = props.goal ? getIdFromNodeId(props.goal.id) : null

    setLoading(true)

    const variables: any = {
      id: goalId ?? uuidv4(),
      user_id: auth.userId,
      title: values["title"],
      description: values["description"],
    }

    const mutationConfig: UseMutationConfig<MutateGoalFormMutation> = {
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

        props.onComplete()
      },
      updater: store => {
        const connectionName = "LeftSidebarInnerQuery_goal_connection"

        updateLocalConnection(
          store,
          connectionName,
          props.goal?.id || null,
          "insert_goal_one",
          "GoalEdge",
          uuidv4()
        )
      },
    }

    commit(mutationConfig)
  }

  return (
    <Suspense fallback={null}>
      <Formik<FormValues>
        initialValues={{ title: "", description: "" }}
        validationSchema={FormSchema}
        onSubmit={submit}>
        {formikProps => (
          <form className="py-2 w-80" onSubmit={formikProps.handleSubmit}>
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
            {errors.length > 0 && (
              <p className="error">Unable to create object.</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={props.onCancel}
                type="button"
                className="btn btn-secondary form-btn rounded w-full mb-2">
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary form-btn rounded w-full mb-2"
                disabled={formikProps.isSubmitting || loading}>
                Add
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Suspense>
  )
}
