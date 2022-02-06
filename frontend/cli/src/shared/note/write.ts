import * as fs from "fs/promises"
import * as path from "path"
import { Note, NoteFileData } from "."
import { dedent } from "../../lib/dedent"
import { MemoneoConfig } from "../config"

export async function writeNoteToFile(
  note: Note,
  config: MemoneoConfig,
  fileInfo: NoteFileData
) {
  const fileText = dedent`---
  id: ${note.id}
  title: ${note.title}
  date: ${note.date}
  ---
  ${note.body}
  ` as string

  const targetFilePath = path.join(
    config.baseDirectory,
    fileInfo.path,
    `${fileInfo.title}.md`
  )

  await fs.mkdir(path.join(config.baseDirectory, fileInfo.path), {
    recursive: true,
  })

  console.log(`writing ${targetFilePath}`)
  await fs.writeFile(targetFilePath, fileText)
}
