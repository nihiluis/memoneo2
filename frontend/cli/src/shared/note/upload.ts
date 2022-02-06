import { Command } from "@oclif/core"
import dayjs = require("dayjs")
import { Note, NoteFileData } from "."
import { AuthResult } from "../../lib/auth"
import { MarkdownFileInfo } from "../../lib/files"
import { createGqlClient } from "../../lib/gql"
import { encryptText } from "../../lib/key"
import { decodeBase64String, encodeBase64String } from "../base64"
import { MemoneoConfig, MemoneoInternalConfig } from "../config"
import { MemoneoFileCache } from "../fileCache"
import { InsertNoteFileDataMutation, InsertNoteMutation } from "./mutation"
import { writeNoteToFile } from "./write"

interface UploadNewNotesConfig {
  mdFiles: MarkdownFileInfo[]
  auth: AuthResult
  key: CryptoKey
  internalConfig: MemoneoInternalConfig
  config: MemoneoConfig
  cache: MemoneoFileCache
  command: Command
}

export async function uploadNewNotes({
  mdFiles,
  auth,
  key,
  config,
  internalConfig,
  cache,
  command,
}: UploadNewNotesConfig) {
  const newNotes: Partial<Note>[] = []
  for (let mdFile of mdFiles) {
    if (!mdFile.metadata.hasOwnProperty("id")) {
      const encryptedText = await encryptText(
        mdFile.text,
        decodeBase64String(auth.enckey!.salt),
        key
      )

      newNotes.push({
        body: encodeBase64String(encryptedText.ctStr),
        title: mdFile.fileName.slice(0, mdFile.fileName.length - ".md".length),
        date: mdFile.time.toISOString(),
        archived: false,
        user_id: internalConfig.userId,
      })
    }
  }

  if (newNotes.length === 0) {
    command.log("No new notes to upload found.")
    return
  }

  const gqlClient = createGqlClient(auth.token, internalConfig!)
  const { data, error } = await gqlClient
    .mutation(InsertNoteMutation, { inputs: newNotes })
    .toPromise()
  if (error) {
    throw error
  }

  if (!data) {
    throw new Error("data not found")
  }

  const insertedNotes: Note[] = data.insert_note.returning
  const noteFileData: NoteFileData[] = []

  for (let note of insertedNotes) {
    const mdFile = mdFiles.find(
      mdFile =>
        dayjs(mdFile.time).format("YYYY-MM-DD") === note.date &&
        mdFile.fileName.slice(0, mdFile.fileName.length - ".md".length) ===
          note.title
    )

    if (!mdFile) {
      throw new Error(
        `Unable to find mdFile for note ${note.id}. Resync necessary.`
      )
    }

    note.body = mdFile.text

    const fileData = {
      title: note.title,
      path: mdFile.path,
      note_id: note.id,
    }

    await writeNoteToFile(note, config, fileData)

    noteFileData.push(fileData)

    cache.trackedNoteIds.push(note.id)
  }

  const { error: error2 } = await gqlClient
    .mutation(InsertNoteFileDataMutation, { inputs: noteFileData })
    .toPromise()
  if (error2) {
    throw error2
  }
}
