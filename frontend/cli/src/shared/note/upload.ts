import { Command } from "@oclif/core"
import { Client } from "@urql/core"
import dayjs = require("dayjs")
import { Note, NoteFileData } from "."
import { AuthResult } from "../../lib/auth"
import { MarkdownFileInfo, md5HashText } from "../../lib/files"
import { createGqlClient } from "../../lib/gql"
import { encryptText } from "../../lib/key"
import { cli } from "../../lib/reexports"
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
  gqlClient: Client
}

export async function uploadNewNotes({
  gqlClient,
  mdFiles,
  auth,
  key,
  config,
  internalConfig,
  cache,
  command,
}: UploadNewNotesConfig) {
  const newNotes: Partial<Note>[] = []
  const newMdFiles = mdFiles.filter(mdFile => !mdFile.metadata.hasOwnProperty("id"))

  const progress = cli.ux.progress({
    format: 'Encrypting... | {bar} | {value}/{total} notes',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  })

  progress.start(newMdFiles.length, 0)
  for (let mdFile of newMdFiles) {
    const encryptedText = await encryptText(
      mdFile.text,
      decodeBase64String(auth.enckey!.salt),
      key
    )

    newNotes.push({
      body: encodeBase64String(encryptedText.ctStr),
      title: mdFile.fileName,
      date: mdFile.time.toISOString(),
      archived: false,
      version: 1,
      user_id: internalConfig.userId,
    })

    progress.increment()
  }
  progress.stop()

  if (newNotes.length === 0) {
    command.log("No new notes to upload found.")
    return
  }

  cli.ux.action.start("Uploading new notes")

  const { data, error } = await gqlClient
    .mutation(InsertNoteMutation, { inputs: newNotes })
    .toPromise()
  if (error) {
    throw error
  }

  if (!data) {
    throw new Error("data not found")
  }

  cli.ux.action.stop()

  const insertedNotes: Note[] = data.insert_note.returning
  const noteFileData: NoteFileData[] = []

  const progress2 = cli.ux.progress({
    format: 'Updating metadata... | {bar} | {value}/{total} notes',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  })

  progress2.start(insertedNotes.length, 0)
  for (let note of insertedNotes) {
    const mdFile = mdFiles.find(
      mdFile =>
        dayjs(mdFile.time).format("YYYY-MM-DD") === note.date &&
        mdFile.fileName === note.title
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

    const noteCacheData = cache.getOrCreateNoteCacheData(note.id)
    noteCacheData.lastMd5Hash = md5HashText(note.body)

    progress2.increment()
  }
  progress2.stop()

  const { error: error2 } = await gqlClient
    .mutation(InsertNoteFileDataMutation, { inputs: noteFileData })
    .toPromise()
  if (error2) {
    throw error2
  }
}
