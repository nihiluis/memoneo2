import { fstat } from "fs"

import * as fs from "fs/promises"
import { decryptText } from "../lib/key"
import * as path from "path"
import { decodeBase64String } from "./base64"
import { dedent } from "../lib/dedent"

export interface Note {
  id: string
  date: string
  body: string
  archived: boolean
  title: string
}

export async function writeNoteToFile(
  note: Note,
  directory: string,
  salt: string,
  key: CryptoKey
) {
  const decryptedBody = await decryptText(
    decodeBase64String(note.body),
    salt,
    key
  )

  const fileText = dedent`---
  id: ${note.id}
  title: ${note.title}
  date: ${note.date}
  ---
  ${decryptedBody}
  ` as string

  const targetFilePath = path.join(directory, `${note.title}.md`)
  console.log(`writing ${targetFilePath}`)
  await fs.writeFile(targetFilePath, fileText)
}
