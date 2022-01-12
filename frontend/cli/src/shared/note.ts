import { fstat } from "fs"

import * as fs from "fs/promises"
import { decryptText } from "../lib/key"
import * as path from "path"
import { decodeBase64String } from "./base64"
import { dedent } from "../lib/dedent"
import { MemoneoConfig } from "./config"

export interface Note {
  id: string
  date: string
  body: string
  archived: boolean
  title: string
  file: NoteFileData
}

export interface NoteFileData {
  title: string
  path: string
}

export async function writeNoteToFile(
  note: Note,
  salt: string,
  key: CryptoKey,
  config: MemoneoConfig
) {
  const decryptedBody = await decryptText(
    decodeBase64String(note.body),
    salt,
    key
  )

  const fileName = note.file?.title ?? note.title
  const filePath = note.file?.path ?? config.defaultDirectory

  const fileText = dedent`---
  id: ${note.id}
  title: ${note.title}
  date: ${note.date}
  ---
  ${decryptedBody}
  ` as string

  const targetFilePath = path.join(
    config.baseDirectory,
    filePath,
    `${fileName}.md`
  )

  await fs.mkdir(path.join(config.baseDirectory, filePath), { recursive: true })

  console.log(`writing ${targetFilePath}`)
  await fs.writeFile(targetFilePath, fileText)
}
