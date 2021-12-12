import React, { useContext, useState } from "react"
import dynamic from "next/dynamic"
import * as Yup from "yup"
import { Formik } from "formik"

import { PRODUCT_NAME } from "../src/constants/env"
import Layout from "../src/components/ui/layout/Layout"
import Auth, { AuthContext } from "../src/components/Auth"
import FormRowInput from "../src/components/ui/form/FormRowInput"
import { register } from "../src/lib/auth"
import Logo from "../src/components/ui/Logo"
import Link from "next/link"

interface FormValues {
  mail: string
  password: string
}

const RegisterFormSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password too short.")
    .max(32, "Password too long.")
    .required("Password is required."),
  mail: Yup.string().email("Invalid mail").required("Mail is required."),
})

function Register() {
  return (
    <Auth require={false}>
      <Layout>
        <RegisterForm />
      </Layout>
    </Auth>
  )
}

export default dynamic(() => Promise.resolve(Register), { ssr: false })

function RegisterForm(): JSX.Element {
  const authContext = useContext(AuthContext)

  const [registerError, setRegisterError] = useState("")
  const [registerLoading, setRegisterLoading] = useState(false)

  const submit = async function (values: FormValues) {
    const { mail, password } = values

    setRegisterLoading(true)

    const { success, token, error, userId } = await register(mail, password)

    setRegisterLoading(false)
    setRegisterError(error)

    authContext!.setAuth({ authenticated: success, token, error, userId })
  }

  return (
    <React.Fragment>
      <div className="mb-4 text-center">
        <Logo width={36} height={36} className="mr-4" />
        <p className="font-semibold" style={{ lineHeight: "24px" }}>
          Register to {PRODUCT_NAME}
        </p>
      </div>
      <Formik<FormValues>
        initialValues={{ mail: "", password: "" }}
        validationSchema={RegisterFormSchema}
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
            {registerError && <p className="error">{registerError}</p>}
            <button
              type="submit"
              className="btn btn-secondary form-btn rounded w-full mb-2"
              disabled={formikProps.isSubmitting || registerLoading}>
              Register
            </button>
            <Link href="/login">Login here.</Link>
          </form>
        )}
      </Formik>
    </React.Fragment>
  )
}
