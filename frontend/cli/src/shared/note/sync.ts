import { Command } from "@oclif/core"
import { Client } from "@urql/core"
import dayjs from "dayjs"
import { Note } from "./index.js"
import { AuthResult } from "../../lib/auth.js"
import { MarkdownFileInfo, md5HashText } from "../../lib/files.js"
import { encryptText } from "../../lib/key.js"
import { decodeBase64String, encodeBase64String } from "../base64.js"
import { MemoneoConfig, MemoneoInternalConfig } from "../config.js"
import { MemoneoFileCache } from "../fileCache.js"
import { InsertNoteFileDataMutation, UpdateNoteMutation } from "./mutation.js"
import { deleteMdFile, writeNoteToFile } from "./write.js"
import { SingleBar } from "cli-progress"

interface SyncNotesConfig {
  notes: Note[]
  mdFiles: MarkdownFileInfo[]
  auth: AuthResult
  key: CryptoKey
  internalConfig: MemoneoInternalConfig
  config: MemoneoConfig
  cache: MemoneoFileCache
  command: Command
  gqlClient: Client
}

export async function syncNotes({
  notes,
  mdFiles,
  auth,
  key,
  config,
  cache,
  command,
  gqlClient,
}: SyncNotesConfig) {
  const noteMap: Record<string, Note> = {}
  const mdFileMap: Record<string, MarkdownFileInfo> = {}

  for (let note of notes) {
    noteMap[note.id] = note
  }

  command.log("Syncing local and remote notes")
  const mdFileData = mdFiles
    .map(mdFile => {
      const id = mdFile.metadata.id
      if (!id) {
        return null
      }

      mdFileMap[id] = mdFile

      if (!noteMap.hasOwnProperty(id)) {
        command.warn(
          `Found local note ${id} which is not registered in the cloud. Skipping sync.`
        )
        return null
      }

      const noteCacheData = cache.getOrCreateNoteCacheData(id)

      const note = noteMap[id]

      const noteDate = dayjs(note.updated_at)
      const mdFileDate = dayjs(mdFile.modifiedTime)

      const md5Hash = md5HashText(mdFile.text)
      const lastMd5Hash = noteCacheData.lastMd5Hash

      const hasNewMd5Hash = lastMd5Hash.length > 0 && md5Hash !== lastMd5Hash
      // can this even exist in sync? should be uploaded earlier
      const isMdFileNew =
        lastMd5Hash.length === 0 && mdFileDate.isAfter(noteDate)
      const newFileNameOrPath =
        mdFile.fileName !== note.file?.title || mdFile.path !== note.file?.path
      // console.log(`note ${note.title} hasNewMd5Hash ${hasNewMd5Hash} isMdFileNew ${isMdFileNew} newFileNameOrPath ${newFileNameOrPath}`)

      return {
        hasNewMd5Hash,
        isMdFileNew,
        md5Hash,
        lastMd5Hash,
        note,
        noteDate,
        mdFileDate,
        noteCacheData,
        mdFile,
        newFileNameOrPath,
      }
    })
    .filter(data => !!data)
    .map(data => data!)

  const outdatedLocalNotes = mdFileData.filter(
    data => data.hasNewMd5Hash || data.isMdFileNew || data.newFileNameOrPath
  )
  const updatedLocalNotes = mdFileData.filter(
    ({ note, mdFile }) => note.file && note.version > mdFile.metadata.version!
  )

  const progress = new SingleBar({
    format: "Update outdated remote notes... | {bar} | {value}/{total} notes",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
  })
  progress.start(outdatedLocalNotes.length, 0)
  // set local content to remote
  for (let localData of outdatedLocalNotes) {
    const {
      mdFile,
      note,
      noteCacheData,
      md5Hash,
      hasNewMd5Hash,
      isMdFileNew,
      newFileNameOrPath,
    } = localData

    const noteFileData = {
      title: mdFile.fileName,
      path: mdFile.path,
      note_id: note.id,
    }

    if (hasNewMd5Hash || isMdFileNew) {
      note.version += 1
      note.body = mdFile.text

      // I'm not sure why this is done here, for the version?
      await writeNoteToFile(note, config, noteFileData)

      const encryptedBody = await encryptText(
        mdFile.text,
        decodeBase64String(auth.enckey!.salt),
        key
      )

      const { data, error } = await gqlClient
        .mutation(UpdateNoteMutation, {
          id: note.id,
          title: mdFile.metadata.title,
          body: encodeBase64String(encryptedBody.ctStr),
          date: mdFile.metadata.date,
          version: note.version,
        })
        .toPromise()
      if (error) {
        throw error
      }

      noteCacheData.lastMd5Hash = md5Hash
      noteCacheData.lastSync = data.update_note_by_pk.updated_at
    }

    if (newFileNameOrPath || isMdFileNew) {
      const { error: error2 } = await gqlClient
        .mutation(InsertNoteFileDataMutation, { inputs: [noteFileData] })
        .toPromise()
      if (error2) {
        throw error2
      }
    }

    progress.increment()
  }
  progress.stop()

  const progress2 = new SingleBar({
    format: "Update outdated local notes... | {bar} | {value}/{total} notes",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
  })
  progress2.start(updatedLocalNotes.length, 0)
  for (let localData of updatedLocalNotes) {
    const { note, mdFile, noteCacheData } = localData

    const updateFileName = note.file!.title !== mdFile.fileName
    const updatePath = note.file!.path !== mdFile.path

    await writeNoteToFile(note, config, {
      path: note.file!.path,
      title: note.file!.title,
    })

    noteCacheData.lastSync = note.updated_at
    noteCacheData.lastMd5Hash = md5HashText(note.body)

    if (updateFileName || updatePath) {
      await deleteMdFile(mdFile, config)
    }
    progress2.increment()
  }

  progress2.stop()
}
