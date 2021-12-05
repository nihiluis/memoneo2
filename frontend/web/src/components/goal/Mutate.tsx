import { Formik } from "formik"
import React, { useState } from "react"
import { ConnectionHandler, useMutation, UseMutationConfig } from "react-relay"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import FormRow from "../ui/form/FormRow"
import { mutation } from "./Mutate.gql"
import { MutateGoalMutation } from "./__generated__/MutateGoalMutation.graphql"
import { getIdFromNodeId } from "../../lib/hasura"
import { PayloadError, ROOT_ID } from "relay-runtime"

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
}

export default function MutateGoalForm(props: Props): JSX.Element {
  const [commit, _] = useMutation<MutateGoalMutation>(mutation)
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  function submit(values: FormValues) {
    const goalId = props.goal ? getIdFromNodeId(props.goal.id) : null

    setLoading(true)

    const mutationConfig: UseMutationConfig<MutateGoalFormMutation> = {
      variables: {
        id: goalId,
        title: values["title"],
        description: values["description"],
      },
      onCompleted: (response, errors) => {
        console.log("completed mutation")

        setLoading(false)
        setErrors(errors)

        if (errors && errors.length !== 0) {
          console.error("found errors " + JSON.stringify(errors))
          return
        }

        props.onComplete()
      },
      updater: store => {
        const baseRecord = store.get(ROOT_ID)

        const connectionName = "MutateDocumentQuery_document_connection"

        const connectionRecord = ConnectionHandler.getConnection(
          baseRecord,
          connectionName,
          {
            order_by: { name: "desc" },
            where: { id: { _eq: goalId } },
          }
        )

        if (!connectionRecord) {
          throw Error("connectionRecord may not be empty")
        }

        const payload = store.getRootField("insert_goal_one")

        //const newRecord = store.create(id, "recently_viewed_document")

        const newEdge = ConnectionHandler.createEdge(
          store,
          connectionRecord,
          payload,
          "goalEdge"
        )

        newEdge.setValue(uuidv4().toString(), "cursor")

        ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge)
      },
    }

    commit(mutationConfig)
  }

  return (
    <Formik<FormValues>
      initialValues={{ title: "", description: "" }}
      validationSchema={FormSchema}
      onSubmit={submit}>
      {formikProps => (
        <form className="form w-80" onSubmit={formikProps.handleSubmit}>
          <FormRow {...formikProps} type="text" name="title" label="Title" />
          <FormRow
            {...formikProps}
            type="text"
            name="description"
            label="description"
          />
          {errors.length > 0 && (
            <p className="error">Unable to create object.</p>
          )}
          <button
            type="submit"
            className="btn btn-secondary form-btn rounded w-full mb-2"
            disabled={formikProps.isSubmitting || loading}>
            Create
          </button>
        </form>
      )}
    </Formik>
  )
}
