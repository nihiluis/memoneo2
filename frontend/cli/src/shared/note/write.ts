import * as fs from "fs/promises"
import * as path from "path"
import { Note, NoteFileData } from "./index.js"
import { dedent } from "../../lib/dedent.js"
import { MarkdownFileInfo } from "../../lib/files.js"
import { MemoneoConfig } from "../config.js"

export async function deleteMdFile(
  mdFile: MarkdownFileInfo,
  config: MemoneoConfig
) {
  await fs.rm(
    path.join(config.baseDirectory, mdFile.path, mdFile.fileName + ".md")
  )
}

export async function writeNoteToFile(
  note: Note,
  config: MemoneoConfig,
  fileInfo: NoteFileData
) {
  const fileText = dedent`---
  id: ${note.id}
  title: ${note.title}
  date: ${note.date}
  version: ${note.version}
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

  await fs.writeFile(targetFilePath, fileText)
}
