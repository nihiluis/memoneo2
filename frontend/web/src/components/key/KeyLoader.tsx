import React, { useEffect, PropsWithChildren, useRef } from "react"
import { useRouter } from "next/router"

import { createNewKey, decryptProtectedKey } from "../../lib/key"
import { useKeyStore } from "../../stores/key"
import {
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "../ui/primitives/Dialog"
import { Formik, FormikProps } from "formik"
import EditorFormRowText from "../mutation/EditorFormRowText"
import Button from "../ui/primitives/Button"

interface Props {}

export default function KeyLoader(props: PropsWithChildren<Props>) {
  const { children } = props

  const router = useRouter()

  const password = useKeyStore(state => state.password)
  const key = useKeyStore(state => state.key)
  const protectedKey = useKeyStore(state => state.protectedKey)
  const salt = useKeyStore(state => state.salt)
  const error = useKeyStore(state => state.error)

  const setKeyData = useKeyStore(state => state.set)

  const cancelled = useRef(false)

  const shouldInquirePassword = !password && !key && !error

  useEffect(() => {
    const loadKey = async () => {
      if (!key && password) {
        if (!protectedKey) {
          console.debug("creating new key")
          const { key, salt, error } = await createNewKey(password)

          if (error) {
            console.error("unable to generate encryption key: " + error)
            setKeyData({ error: "no key available", password: "" })
            return
          }

          setKeyData({ key, salt, password: "" })
        } else {
          // decrypt key to use for encryption
          console.log("decrypting existing key")

          const key = await decryptProtectedKey(password, protectedKey, salt)
          setKeyData({ key, salt, password: "" })
        }
      }
    }

    loadKey()
  }, [password, salt, protectedKey, key, setKeyData])

  function onSubmitPassword(values: FormValues) {
    // password should be validated. TODO
    setKeyData({ password: values.password })
  }

  return (
    <React.Fragment>
      <DialogRoot open={shouldInquirePassword}>
        <DialogContent style={{ maxWidth: 380 }}>
          <DialogTitle>Password required</DialogTitle>
          <DialogDescription className="mb-4">
            Please enter your password for encryption/decryption of your notes.
          </DialogDescription>
          <Formik<FormValues>
            initialValues={{
              password: "",
            }}
            onSubmit={onSubmitPassword}>
            {formikProps => <KeyLoaderForm {...formikProps} />}
          </Formik>
        </DialogContent>
      </DialogRoot>
      {children}
    </React.Fragment>
  )
}

interface FormValues {
  password: string
}

function KeyLoaderForm(props: FormikProps<FormValues>): JSX.Element {
  return (
    <form onSubmit={props.handleSubmit}>
      <EditorFormRowText
        type="password"
        {...props}
        name="password"
        label="Password"
      />
      <Button
        type="submit"
        className="btn btn-secondary form-btn rounded w-full mb-2">
        Set password
      </Button>
    </form>
  )
}
