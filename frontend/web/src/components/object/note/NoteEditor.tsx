import { Formik } from "formik"
import React, { Suspense, useContext, useEffect, useRef, useState } from "react"
import { useFragment, useLazyLoadQuery, useMutation } from "react-relay"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import { mutation, query } from "./NoteEditor.gql"
import { getIdFromNodeId } from "../../../lib/hasura"
import { PayloadError } from "relay-runtime"
import { AuthContext } from "../../Auth"
import { useFilterStore } from "../../../stores/filter"
import { DEFAULT_NOTE_CONNECTION } from "../../../constants/connections"
import { getRootConnectionIds } from "../../../relay/getConnection"
import EditorFormWrapper from "../../mutation/EditorFormWrapper"
import getMutationConfig from "../../mutation/getMutationConfig"
import EditorHeader from "../../mutation/EditorHeader"
import EditorFormRowText from "../../mutation/EditorFormRowText"
import EditorFormRowSelectButton from "../../mutation/EditorFormRowSelectButton"
import {
  NoteEditorMutation,
  NoteEditorMutationResponse,
  NoteEditorMutationVariables,
} from "./__generated__/NoteEditorMutation.graphql"
import EditorSwitch from "../../mutation/EditorSwitch"
import dayjs from "dayjs"
import {
  NoteEditorDataQuery,
  NoteEditorDataQueryResponse,
} from "./__generated__/NoteEditorDataQuery.graphql"
import { noteFragment, NoteRef } from "./NoteFragment.gql"
import { NoteFragment$key } from "./__generated__/NoteFragment.graphql"
import { nullUuid } from "../../../constants/other"
import EditorFormRowMarkdown from "../../mutation/EditorFormRowMarkdown"
import RequireKey from "../../key/RequireKey"
import { decryptText, encryptText } from "../../../lib/key"
import { useKeyStore } from "../../../stores/key"
import NoteEditorGoals from "./NoteEditorGoals"
import FormRowFlexWrapper from "../../ui/form/FormRowFlexWrapper"
import { ObjectGeneric } from ".."

export interface FormValues {
  title: string
  body: string
  pinned: boolean
  date?: string
  goals: string[]
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
  body?: string
  date: string | unknown
  pinned: boolean
}

interface Props {
  item?: Note
  onComplete(): void
  onCancel(): void
}

export default function NoteEditor(props: Props): JSX.Element {
  return (
    <RequireKey>
      <Suspense fallback={null}>
        <NoteEditorLoader {...props} />
      </Suspense>
    </RequireKey>
  )
}

function NoteEditorLoader(props: Props): JSX.Element {
  const { item: preloadedNote } = props
  const [nullId] = useState(nullUuid)

  const noteId = preloadedNote ? getIdFromNodeId(preloadedNote.id) : null

  const data = useLazyLoadQuery<NoteEditorDataQuery>(query, {
    id: noteId ?? nullId,
  })

  const noteRef =
    data.note_connection.edges.length === 1
      ? data.note_connection.edges[0].node
      : null

  return (
    <NoteEditorInner {...props} noteId={noteId ?? nullId} noteRef={noteRef} />
  )
}

interface InnerProps {
  noteId?: string
  noteRef?: NoteRef
}

function NoteEditorInner(props: Props & InnerProps): JSX.Element {
  const { item: preloadedNote, onComplete, onCancel, noteId, noteRef } = props
  const operationType = !!preloadedNote ? "edit" : "add"

  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [decryptedBody, setDecryptedBody] = useState("")
  const [initializedBody, setInitializedBody] = useState(false)

  // noteditcomplete hook should be next. a bit annoying because the dialog is closed immediately

  const { auth } = useContext(AuthContext)

  const closed = useRef(false)

  const key = useKeyStore(state => state.key)
  const salt = useKeyStore(state => state.salt)

  const defaultNoteFilters = useFilterStore(state =>
    state.getFilters(DEFAULT_NOTE_CONNECTION)
  )

  const [commit, _] = useMutation<NoteEditorMutation>(mutation)
  const note = useFragment<NoteFragment$key>(noteFragment, noteRef)
  const goalRefs = note?.note_goal_connection.edges.map(edge => edge.node) ?? []

  useEffect(() => {
    async function load() {
      if (closed.current) return

      if (note) {
        const text = await decryptText(window.atob(note.body), salt, key)
        setDecryptedBody(text)
      }

      setInitializedBody(true)
    }

    load()

    return () => {
      closed.current = true
    }
  }, [note, key, salt])

  async function submit(values: FormValues) {
    setLoading(true)

    // if equals nullUuid, we are creating a new note and need a new uuid
    const id = noteId === nullUuid ? uuidv4() : noteId
    const encryptedBody = await encryptText(values["body"], salt, key)

    const variables: NoteEditorMutationVariables = {
      id: id,
      user_id: auth.userId,
      title: values["title"],
      body: window.btoa(encryptedBody.ctStr),
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
      <div style={{ width: 1060 }}>
        <EditorHeader operationType={operationType} objectType="note" />
        {initializedBody && (
          <Formik<FormValues>
            initialValues={{
              title: note?.title ?? "",
              body: decryptedBody,
              pinned: note?.pinned ?? false,
              date: (note?.date as string) ?? dayjs().format("YYYY-MM-DD"),
              goals: [],
            }}
            validationSchema={FormSchema}
            onSubmit={submit}>
            {formikProps => (
              <EditorFormWrapper
                formikProps={formikProps}
                error={errors.length > 0 ? "error" : ""}
                onCancel={onCancel}
                type={operationType}
                loading={loading}
                className="w-full">
                <EditorFormRowText
                  {...formikProps}
                  type="text"
                  name="title"
                  label="Title"
                />
                <FormRowFlexWrapper>
                  <EditorFormRowText
                    {...formikProps}
                    type="date"
                    name="date"
                    label="Date"
                    style={{ maxWidth: 180 }}
                  />
                  <EditorSwitch {...formikProps} name="pinned" label="Pin" />
                </FormRowFlexWrapper>
                <NoteEditorGoals
                  {...formikProps}
                  noteGoals={goalRefs}
                  operationType={operationType}
                />
                <EditorFormRowMarkdown
                  {...formikProps}
                  name="body"
                  label="Body"
                />
              </EditorFormWrapper>
            )}
          </Formik>
        )}
      </div>
    </Suspense>
  )
}
