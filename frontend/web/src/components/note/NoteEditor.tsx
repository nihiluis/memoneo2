import { Formik } from "formik"
import React, { Suspense, useContext, useState } from "react"
import { useLazyLoadQuery, useMutation } from "react-relay"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import { mutation } from "./NoteEditor.gql"
import { getIdFromNodeId } from "../../lib/hasura"
import { PayloadError } from "relay-runtime"
import { AuthContext } from "../Auth"
import { useFilterStore } from "../../stores/filter"
import { DEFAULT_NOTE_CONNECTION } from "../../constants/connections"
import { getRootConnectionIds } from "../../relay/getConnection"
import EditorFormWrapper from "../mutation/EditorFormWrapper"
import getMutationConfig from "../mutation/getMutationConfig"
import EditorHeader from "../mutation/EditorHeader"
import EditorFormRowText from "../mutation/EditorFormRowText"
import EditorFormRowTextarea from "../mutation/EditorFormRowTextarea"
import {
  NoteEditorMutation,
  NoteEditorMutationVariables,
} from "./__generated__/NoteEditorMutation.graphql"
import EditorSwitch from "../mutation/EditorSwitch"
import dayjs from "dayjs"

interface FormValues {
  title: string
  body: string
  pinned: boolean
  date?: string
}

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too short.")
    .max(32, "Too long.")
    .required("Required."),
  body: Yup.string(),
  pinned: Yup.boolean(),
  date: Yup.string().required(),
})

interface Note {
  id: string
  title: string
  body: string
  date: string
  pinned: boolean
}

interface Props {
  note?: Note
  onComplete(): void
  onCancel(): void
}

export default function NoteEditor(props: Props): JSX.Element {
  const [commit, _] = useMutation<NoteEditorMutation>(mutation)
  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { auth } = useContext(AuthContext)

  const { note, onComplete, onCancel } = props

  const noteId = note ? getIdFromNodeId(note.id) : null

  const operationType = !!note ? "edit" : "add"

  const defaultNoteFilters = useFilterStore(state =>
    state.getFilters(DEFAULT_NOTE_CONNECTION)
  )

  useLazyLoadQuery()

  function submit(values: FormValues) {
    setLoading(true)

    const variables: NoteEditorMutationVariables = {
      id: noteId ?? uuidv4(),
      user_id: auth.userId,
      title: values["title"],
      body: values["body"],
      pinned: values["pinned"] ?? false,
      date: values["date"],
      connections: [
        ...getRootConnectionIds(DEFAULT_NOTE_CONNECTION, defaultNoteFilters),
      ],
    }

    const mutationConfig = getMutationConfig<NoteEditorMutation>(variables, {
      setErrors,
      setLoading,
      onComplete,
    })

    commit(mutationConfig)
  }

  return (
    <Suspense fallback={null}>
      <EditorHeader operationType={operationType} objectType="note" />
      <Formik<FormValues>
        initialValues={{
          title: note?.title ?? "",
          body: note?.body ?? "",
          pinned: note?.pinned ?? false,
          date: note?.date ?? dayjs().format("YYYY-MM-DD"),
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
              type="date"
              name="date"
              label="Date"
            />
            <EditorFormRowTextarea {...formikProps} name="body" label="Body" />
            <EditorSwitch {...formikProps} name="pinned" label="Pin" />
          </EditorFormWrapper>
        )}
      </Formik>
    </Suspense>
  )
}
