import { Formik, FormikProps } from "formik"
import React, { Suspense, useContext, useEffect, useRef, useState } from "react"
import { useFragment, useLazyLoadQuery, useMutation } from "react-relay"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import { mutation, query } from "./NoteEditor.gql"
import { PayloadError } from "relay-runtime"
import { AuthContext } from "../../Auth"
import { useFilterStore } from "../../../stores/filter"
import { DEFAULT_NOTE_CONNECTION } from "../../../constants/connections"
import { getRootConnectionIds } from "../../../relay/getConnection"
import EditorFormWrapper from "../../mutation/EditorFormWrapper"
import getMutationConfig from "../../mutation/getMutationConfig"
import EditorFormRowText from "../../mutation/EditorFormRowText"
import {
  NoteEditorMutation,
  NoteEditorMutationResponse,
  NoteEditorMutationVariables,
} from "./__generated__/NoteEditorMutation.graphql"
import EditorSwitch from "../../mutation/EditorSwitch"
import dayjs from "dayjs"
import {
  NoteEditorDataQuery,
} from "./__generated__/NoteEditorDataQuery.graphql"
import { noteFragment, NoteRef } from "./NoteFragment.gql"
import { NoteFragment$key } from "./__generated__/NoteFragment.graphql"
import { nullUuid } from "../../../constants/other"
import EditorFormRowMarkdown from "../../mutation/EditorFormRowMarkdown"
import RequireKey from "../../key/RequireKey"
import { decryptText, encryptText } from "../../../lib/key"
import { useKeyStore } from "../../../stores/key"
import NoteEditorGoals, { NoteEditorGoalsHandle } from "./NoteEditorGoals"
import FormRowFlexWrapper from "../../ui/form/FormRowFlexWrapper"
import FormInput from "../../ui/form/FormInput"
import { SeparatorHorizontal } from "../../ui/Separator"

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
  id?: string
  onComplete(): void
  onCancel(): void
}

export default function NoteEditor(props: Props): JSX.Element {
  return (
    <Suspense fallback={null}>
      <NoteEditorLoader {...props} />
    </Suspense>
  )
}

function NoteEditorLoader(props: Props): JSX.Element {
  const { id: noteId } = props
  const [nullId] = useState(nullUuid)

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
  const { onComplete, onCancel, noteId, noteRef } = props
  const operationType = !!noteId ? "edit" : "add"

  const [errors, setErrors] = useState<PayloadError[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [decryptedBody, setDecryptedBody] = useState("")
  const [initializedBody, setInitializedBody] = useState(false)

  const { auth } = useContext(AuthContext)

  const closed = useRef(false)
  const titleInputRef = useRef()
  const goalsRef = useRef<NoteEditorGoalsHandle | undefined>()

  const key = useKeyStore(state => state.key)
  const salt = useKeyStore(state => state.salt)

  const defaultNoteFilters = useFilterStore(state =>
    state.getFilters(DEFAULT_NOTE_CONNECTION)
  )

  const [commit, _] = useMutation<NoteEditorMutation>(mutation)
  const note = useFragment<NoteFragment$key>(noteFragment, noteRef)
  const currentSelectedGoals =
    note?.note_goal_connection.edges.map(edge => edge.node) ?? []

  useEffect(() => {
    closed.current = false
    async function load() {
      if (closed.current) return

      if (note && key) {
        console.log("decrypting text")
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

  function onCompleteEdit(values: FormValues) {
    return function inner(response?: NoteEditorMutationResponse) {
      if (!response) {
        return
      }

      if (goalsRef.current) {
        const noteId = response.insert_note.returning[0].id
        goalsRef.current.submit(noteId, values)
      }

      onComplete()
    }
  }

  async function submit(values: FormValues) {
    setLoading(true)

    // if equals nullUuid, we are creating a new note and need a new uuid
    const id = noteId === nullUuid ? uuidv4() : noteId
    const encryptedBody = await encryptText(values["body"], salt, key)
    const version = note?.version + 1 ?? 1

    const variables: NoteEditorMutationVariables = {
      id: id,
      user_id: auth.userId,
      title: values["title"],
      body: window.btoa(encryptedBody.ctStr),
      pinned: values["pinned"] ?? false,
      date: values["date"],
      version,
      connections: [
        ...getRootConnectionIds(DEFAULT_NOTE_CONNECTION, defaultNoteFilters),
      ],
    }

    const mutationConfig = getMutationConfig<NoteEditorMutation>(variables, {
      setErrors,
      setLoading,
      onComplete: onCompleteEdit(values),
    })

    commit(mutationConfig)
  }

  return (
    <Suspense fallback={null}>
      <div>
        {initializedBody && (
          <Formik<FormValues>
            initialValues={{
              title: note?.title ?? "",
              body: decryptedBody,
              pinned: note?.pinned ?? false,
              date: (note?.date as string) ?? dayjs().format("YYYY-MM-DD"),
              goals: currentSelectedGoals.map(goal => goal.goal.id),
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
                <FormInput
                  {...formikProps}
                  type="text"
                  name="title"
                  autoFocus
                  className="pl-0 mb-2 text-lg font-semibold w-full"
                  applyDefaultClass={false}
                />
                <SeparatorHorizontal className="mb-2" />
                <FormRowFlexWrapper>
                  <EditorFormRowText
                    {...formikProps}
                    type="date"
                    name="date"
                    label="Date"
                    className="mr-2"
                    style={{ maxWidth: 180 }}
                  />
                  <EditorSwitch {...formikProps} name="pinned" label="Pin" />
                </FormRowFlexWrapper>
                <RequireKey>
                  <DecryptedBodyUpdater
                    {...formikProps}
                    fieldName="body"
                    decryptedBody={decryptedBody}
                  />
                  <EditorFormRowMarkdown
                    {...formikProps}
                    name="body"
                    label="Body"
                  />
                </RequireKey>
                <NoteEditorGoals
                  ref={goalsRef}
                  {...formikProps}
                  currentSelectedItems={currentSelectedGoals}
                  operationType={operationType}
                />
              </EditorFormWrapper>
            )}
          </Formik>
        )}
      </div>
    </Suspense>
  )
}

function DecryptedBodyUpdater(
  props: FormikProps<{}> & { decryptedBody: string; fieldName: string }
): JSX.Element {
  const { decryptedBody, fieldName, setFieldValue } = props

  useEffect(() => {
    setFieldValue(fieldName, decryptedBody)
  }, [decryptedBody])

  return null
}
