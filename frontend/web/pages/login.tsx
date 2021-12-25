import React, { useContext, useState } from "react"
import dynamic from "next/dynamic"
import * as Yup from "yup"
import { Formik } from "formik"
import Link from "next/link"

import { PRODUCT_NAME } from "../src/constants/env"
import Layout from "../src/components/ui/layout/Layout"
import Auth, { AuthContext } from "../src/components/Auth"
import FormRowInput from "../src/components/ui/form/FormRowInput"
import { login, setSessionToken } from "../src/lib/auth"
import Logo from "../src/components/ui/Logo"
import { useKeyStore } from "../src/stores/key"

interface FormValues {
  mail: string
  password: string
}

const LoginFormSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password too short.")
    .max(32, "Password too long.")
    .required("Password is required."),
  mail: Yup.string().email("Invalid mail").required("Mail is required."),
})

function Login() {
  return (
    <Auth require={false}>
      <Layout>
        <LoginForm />
      </Layout>
    </Auth>
  )
}

export default dynamic(() => Promise.resolve(Login), { ssr: false })

function LoginForm(): JSX.Element {
  const authContext = useContext(AuthContext)

  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  const setKey = useKeyStore(state => state.set)

  const submit = async function (values: FormValues) {
    const { mail, password } = values

    setLoginLoading(true)

    const { success, token, enckey, error, userId } = await login(
      mail,
      password
    )

    setLoginLoading(false)
    setLoginError(error)
    if (token) {
      setSessionToken(token)
    }

    authContext!.setAuth({ authenticated: success, token, error, userId })

    if (!enckey) {
      setKey({ password })
    } else {
      setKey({
        protectedKey: window.atob(enckey.key),
        salt: window.atob(enckey.salt),
        password,
      })
    }
  }

  return (
    <React.Fragment>
      <div className="mb-4 text-center">
        <Logo width={36} height={36} className="mr-4" />
        <p className="font-semibold" style={{ lineHeight: "24px" }}>
          Login to {PRODUCT_NAME}
        </p>
      </div>
      <Formik<FormValues>
        initialValues={{ mail: "", password: "" }}
        validationSchema={LoginFormSchema}
        onSubmit={submit}>
        {formikProps => (
          <form className="form w-80" onSubmit={formikProps.handleSubmit}>
            <FormRowInput
              {...formikProps}
              type="email"
              name="mail"
              label="Mail"
            />
            <FormRowInput
              {...formikProps}
              type="password"
              name="password"
              label="Password"
            />
            {loginError && <p className="error">{loginError}</p>}
            <button
              type="submit"
              className="btn btn-secondary form-btn rounded w-full mb-2"
              disabled={formikProps.isSubmitting || loginLoading}>
              Login
            </button>
            <Link href="/register">Register here.</Link>
          </form>
        )}
      </Formik>
    </React.Fragment>
  )
}
