import React from "react"
import { MemoObjectType } from "../types"
import { SeparatorHorizontal } from "../ui/Separator"

interface Props {
  operationType: "edit" | "add"
  objectType: MemoObjectType
}

export default function EditorHeader(props: Props): JSX.Element {
  const { operationType, objectType } = props

  const operationText = operationType === "edit" ? "Edit" : "Add"
  const objectTypeText =
    objectType.charAt(0).toUpperCase() + objectType.slice(1)

  return (
    <div>
      <h2>
        {operationText} {objectTypeText}
      </h2>
      <SeparatorHorizontal className="mt-2 mb-1" />
    </div>
  )
}
