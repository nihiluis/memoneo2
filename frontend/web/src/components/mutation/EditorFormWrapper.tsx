import { FormikProps } from "formik"
import React, { PropsWithChildren, Suspense, useContext, useState } from "react"
import { cx } from "../../lib/reexports"

interface Props extends PropsWithChildren<{}> {
  error: string
  type: "edit" | "add"
  formikProps: FormikProps<any>
  onCancel: () => void
  loading: boolean
  className?: string
}

export default function EditorFormWrapper(props: Props): JSX.Element {
  const { error, formikProps, type, loading, className } = props

  return (
    <Suspense fallback={null}>
      <form
        className={cx("py-2 w-80", className)}
        onSubmit={formikProps.handleSubmit}>
        {props.children}
        {error.length > 0 && <p className="error">Unable to create object.</p>}
        <div className="flex gap-2">
          <button
            onClick={props.onCancel}
            type="button"
            className="btn btn-secondary form-btn rounded w-full mb-2">
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary form-btn rounded w-full mb-2"
            disabled={formikProps.isSubmitting || loading}>
            {type === "edit" ? "Edit" : "Add"}
          </button>
        </div>
      </form>
    </Suspense>
  )
}
