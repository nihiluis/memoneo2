import { Formik } from "formik"
import React, { Suspense, useContext, useState } from "react"
import { useMutation } from "react-relay"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import { mutation } from "./TodoMutate.gql"
import { getIdFromNodeId } from "../../lib/hasura"
import { PayloadError } from "relay-runtime"
import { AuthContext } from "../Auth"
import { useFilterStore } from "../../stores/filter"
import { DEFAULT_TODO_CONNECTION } from "../../constants/connections"
import { getRootConnectionIds } from "../../relay/getConnection"
import MutationFormWrapper from "../mutation/MutationFormWrapper"
import getMutationConfig from "../mutation/getMutationConfig"
import MutationHeader from "../mutation/MutationHeader"
import {
  TodoMutateMutation,
  TodoMutateMutationVariables,
} from "./__generated__/TodoMutateMutation.graphql"
import MutationFormRow from "../mutation/MutationFormRow"

interface FormValues {
  title: string
}

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too short.")
    .max(32, "Too long.")
    .required("Required."),
})

interface Props {
  todo?: { id: string; title: string; description: string }
  onComplete(): void
  onCancel(): void
}

export default function TodoMutate(props: Props): JSX.Element {
  const [commit, _] = useMutation<TodoMutateMutation>(mutation)
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { auth } = useContext(AuthContext)

  const { todo, onComplete, onCancel } = props

  const operationType = !!todo ? "edit" : "add"

  const defaultTodoFilters = useFilterStore(state =>
    state.getFilters(DEFAULT_TODO_CONNECTION)
  )

  function submit(values: FormValues) {
    const todoId = todo ? getIdFromNodeId(todo.id) : null

    setLoading(true)

    const variables: TodoMutateMutationVariables = {
      id: todoId ?? uuidv4(),
      user_id: auth.userId,
      title: values["title"],
      connections: [
        ...getRootConnectionIds(DEFAULT_TODO_CONNECTION, defaultTodoFilters),
      ],
    }

    const mutationConfig = getMutationConfig<TodoMutateMutation>(variables, {
      setErrors,
      setLoading,
      onComplete,
    })

    commit(mutationConfig)
  }

  return (
    <Suspense fallback={null}>
      <MutationHeader operationType={operationType} objectType="todo" />
      <Formik<FormValues>
        initialValues={{
          title: todo?.title ?? "",
        }}
        validationSchema={FormSchema}
        onSubmit={submit}>
        {formikProps => (
          <MutationFormWrapper
            formikProps={formikProps}
            error={errors.length > 0 ? "error" : ""}
            onCancel={onCancel}
            type={operationType}
            loading={loading}>
            <MutationFormRow
              {...formikProps}
              type="text"
              name="title"
              label="Title"
            />
          </MutationFormWrapper>
        )}
      </Formik>
    </Suspense>
  )
}
