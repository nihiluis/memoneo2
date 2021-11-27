import React, { useContext, useState } from "react"

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

export default function Login() {
  return (
    <Auth require={false}>
      <Layout>
        <LoginForm />
      </Layout>
    </Auth>
  )
}

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
      <h2 className="title-big title-big-margin">Log in to {PRODUCT_NAME}</h2>
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
              className="btn btn-secondary form-btn"
              disabled={formikProps.isSubmitting || loginLoading}>
              Submit
            </button>
          </form>
        )}
      </Formik>
    </React.Fragment>
  )
}
