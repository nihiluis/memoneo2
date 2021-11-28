import React, { useContext, useState } from "react"
import dynamic from "next/dynamic"

import { Formik, FormikErrors } from "formik"

import { PRODUCT_NAME } from "../src/constants/env"
import Layout from "../src/components/ui/Layout"
import Auth, { AuthContext } from "../src/components/Auth"
import FormRow from "../src/components/form/FormRow"
import { login } from "../src/lib/auth"

interface FormValues {
  mail: string
  password: string
}

function validate(values: FormValues): FormikErrors<FormValues> {
  return {}
}

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

  const submit = async function (values: FormValues) {
    const { mail, password } = values

    setLoginLoading(true)

    const { success, token, error, userId } = await login(mail, password)

    setLoginLoading(false)
    setLoginError(error)

    authContext!.setAuth({ authenticated: success, token, error, userId })
  }

  return (
    <React.Fragment>
      <Formik<FormValues>
        initialValues={{ mail: "", password: "" }}
        validate={validate}
        onSubmit={submit}>
        {formikProps => (
          <form className="form" onSubmit={formikProps.handleSubmit}>
            <FormRow {...formikProps} type="email" name="mail" label="Mail" />
            <FormRow
              {...formikProps}
              type="password"
              name="password"
              label="Password"
            />
            {loginError && <p className="error">{loginError}</p>}
            <button
              type="submit"
              className="btn btn-secondary form-btn w-full mb-2"
              disabled={formikProps.isSubmitting || loginLoading}>
              Log in
            </button>
          </form>
        )}
      </Formik>
    </React.Fragment>
  )
}
