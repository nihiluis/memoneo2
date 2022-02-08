import { Command } from "@oclif/core"
import { Client } from "@urql/core"
import dayjs = require("dayjs")
import { fstat } from "fs"
import { Note, NoteFileData } from "."
import { AuthResult } from "../../lib/auth"
import { MarkdownFileInfo, md5HashText } from "../../lib/files"
import { createGqlClient } from "../../lib/gql"
import { encryptText } from "../../lib/key"
import { decodeBase64String, encodeBase64String } from "../base64"
import { MemoneoConfig, MemoneoInternalConfig } from "../config"
import { MemoneoFileCache } from "../fileCache"
import {
  InsertNoteFileDataMutation,
  InsertNoteMutation,
  UpdateNoteFileDataMutation,
  UpdateNoteMutation,
} from "./mutation"
import { deleteMdFile, writeNoteToFile } from "./write"

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
  internalConfig,
  cache,
  command,
  gqlClient,
}: SyncNotesConfig) {
  const noteMap: Record<string, Note> = {}
  const mdFileMap: Record<string, MarkdownFileInfo> = {}

  for (let note of notes) {
    noteMap[note.id] = note
  }

  for (let mdFile of mdFiles) {
    if (!mdFile.metadata.hasOwnProperty("id")) {
      continue
    }

    const id = mdFile.metadata.id
    mdFileMap[id] = mdFile

    if (!noteMap.hasOwnProperty(id)) {
      command.warn(
        `Found local note ${id} which is not registered in the cloud. Skipping sync.`
      )
      continue
    }

    const noteCacheData = cache.getOrCreateNoteCacheData(id)

    const note = noteMap[id]

    const noteDate = dayjs(note.updated_at)
    const mdFileDate = dayjs(mdFile.time)

    const md5Hash = md5HashText(mdFile.text)
    const lastMd5Hash = noteCacheData.lastMd5Hash

    const hasNewMd5Hash = lastMd5Hash.length > 0 && md5Hash !== lastMd5Hash
    const isMdFileNew = lastMd5Hash.length === 0 && mdFileDate.isAfter(noteDate)

    if (hasNewMd5Hash || isMdFileNew) {
      // set remote content to local
      const encryptedBody = await encryptText(
        mdFile.text,
        decodeBase64String(auth.enckey!.salt),
        key
      )

      const noteFileData = {
        title: mdFile.fileName,
        path: mdFile.path,
        note_id: note.id,
      }
      note.version += 1
      note.body = mdFile.text

      await writeNoteToFile(note, config, noteFileData)

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

      const { error: error2 } = await gqlClient
        .mutation(UpdateNoteFileDataMutation, noteFileData)
        .toPromise()
      if (error2) {
        throw error2
      }
    } else {
      if (note.file && note.version > mdFile.metadata.version) {
        const updateFileName = note.file.title !== mdFile.fileName
        const updatePath = note.file.path !== mdFile.path

        await writeNoteToFile(note, config, {
          path: note.file.path,
          title: note.file.title,
        })

        noteCacheData.lastSync = note.updated_at
        noteCacheData.lastMd5Hash = md5HashText(note.body)

        if (updateFileName || updatePath) {
          await deleteMdFile(mdFile, config)
        }
      }
    }
  }
}
