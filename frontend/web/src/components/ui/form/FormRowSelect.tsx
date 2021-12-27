import React, { useEffect, useState } from "react"
import { FormikProps } from "formik"
import { cx } from "../../../lib/reexports"
import FormRowWrapper from "./FormRowWrapper"
import Select, { GroupBase, Options, OptionsOrGroups } from "react-select"

export interface Option {
  label: string
  value: string
}

interface Props<T> extends FormikProps<T> {
  label: string
  name: string
  innerClassName?: string
  options: Options<Option>
  isMulti?: boolean
}

export default function FormRowSelect<T>(props: Props<T>) {
  const {
    name,
    isMulti,
    options: rawOptions,
    setFieldValue,
    handleBlur,
    values,
    innerClassName = "",
  } = props

  const [options, setOptions] = useState<Record<string, Option>>({})

  useEffect(() => {
    const optionsMap = {}
    for (let opt of rawOptions) {
      optionsMap[opt.value] = opt
    }
    setOptions(optionsMap)
  }, [rawOptions])

  return (
    <FormRowWrapper {...props}>
      <Select
        options={rawOptions}
        value={values[name].map((value: string) => options[value])}
        isMulti={isMulti}
        onChange={options =>
          setFieldValue(
            name,
            options.map((opt: Option) => opt.value)
          )
        }
        onBlur={handleBlur}
      />
    </FormRowWrapper>
  )
}
