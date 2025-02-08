import { Command } from "@oclif/core"
import { Client } from "@urql/core"
import dayjs, { Dayjs } from "dayjs"
import { Note } from "./index.js"
import { AuthResult } from "../../lib/auth.js"
import { MarkdownFileInfo, md5HashText } from "../../lib/files.js"
import { encryptText, decryptText } from "../../lib/key.js"
import { decodeBase64String, encodeBase64String } from "../base64.js"
import { MemoneoConfig, MemoneoInternalConfig } from "../config.js"
import { MemoneoFileCache, NoteCacheData } from "../fileCache.js"
import { InsertNoteFileDataMutation, UpdateNoteMutation } from "./mutation.js"
import { deleteMdFile, writeNoteToFile } from "./write.js"
import { SingleBar } from "cli-progress"
import { limitTitleLength } from "./noteTitle.js"
import { promptConfirmation } from "../confirmation.js"
import { cliUx } from "../../lib/reexports.js"

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

interface MarkdownFileSyncData {
  outdatedType: OutdatedType | null
  hasNewMd5Hash: boolean
  isMdFileNew: boolean
  // The local md5hash of the text in the md file.
  localMd5Hash: string
  // The last md5hash of the text that was written to remote.
  lastMd5Hash: string
  note: Note
  noteDate: Dayjs
  mdFileDate: Dayjs
  noteCacheData: NoteCacheData
  mdFile: MarkdownFileInfo
  newFileNameOrPath: boolean
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

  cliUx.action.start("Retrieving local and remote changes to notes")
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

      const localMd5Hash = md5HashText(mdFile.text)
      const lastMd5Hash = noteCacheData.lastMd5Hash

      const hasNewMd5Hash =
        lastMd5Hash.length > 0 && localMd5Hash !== lastMd5Hash

      // can this even exist in sync? should be uploaded earlier
      const isMdFileNew =
        lastMd5Hash.length === 0 && mdFileDate.isAfter(noteDate)
      const newFileNameOrPath =
        mdFile.fileName !== note.file?.title || mdFile.path !== note.file?.path
      // console.log(`note ${note.title} hasNewMd5Hash ${hasNewMd5Hash} isMdFileNew ${isMdFileNew} newFileNameOrPath ${newFileNameOrPath}`)

      const outdatedType: OutdatedType | null = hasNewMd5Hash
        ? "Modified"
        : isMdFileNew
        ? "New"
        : newFileNameOrPath
        ? "LocationChanged"
        : null

      return {
        outdatedType,
        hasNewMd5Hash,
        isMdFileNew,
        localMd5Hash,
        lastMd5Hash,
        note,
        noteDate,
        mdFileDate,
        noteCacheData,
        mdFile,
        newFileNameOrPath,
      } satisfies MarkdownFileSyncData
    })
    .filter(data => !!data)
    .map(data => data!)

  cliUx.action.stop()

  const updatedLocalNotes = await writeUpdatedNotesFromLocalToRemote(
    mdFileData,
    command,
    config,
    auth,
    key,
    gqlClient
  )
  const updatedLocalNotesIds = updatedLocalNotes.map(note => note.note.id)

  const filteredMdFileData = mdFileData.filter(
    data => !updatedLocalNotesIds.includes(data.note.id)
  )

  await writeUpdatedNotesFromRemoteToLocal(
    filteredMdFileData,
    command,
    config,
    auth,
    key
  )
}

async function writeUpdatedNotesFromRemoteToLocal(
  mdFileData: MarkdownFileSyncData[],
  command: Command,
  config: MemoneoConfig,
  auth: AuthResult,
  key: CryptoKey
) {
  const updatedRemoteNotes = mdFileData.filter(
    ({ note, mdFile }) => note.file && note.version > mdFile.metadata.version!
  )

  // TODO what happens if a note is outdated from remote but was updated locally, what takes precedence?
  if (updatedRemoteNotes.length === 0) {
    command.log("No note changes found to push to remote.")
    return
  }

  command.log("")
  // The notes that have been updated remotely
  command.log("Updated remote notes:")
  updatedRemoteNotes.forEach(note =>
    command.log(`* ${limitTitleLength(note.note.title ?? "! Title missing")}`)
  )
  command.log("")
  command.log("Do you want to write the changes to local?")
  await promptConfirmation(command)
  const progress2 = new SingleBar({
    format: "Update outdated local notes... | {bar} | {value}/{total} notes",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
  })
  progress2.start(updatedRemoteNotes.length, 0)
  for (let localData of updatedRemoteNotes) {
    const { note, mdFile, noteCacheData, localMd5Hash } = localData

    const updateFileName = note.file!.title !== mdFile.fileName
    const updatePath = note.file!.path !== mdFile.path

    const decryptedBody = await decryptText(
      decodeBase64String(note.body),
      decodeBase64String(note.body_iv),
      key
    )
    await writeNoteToFile(note, decryptedBody, config, {
      path: note.file!.path,
      title: note.file!.title,
    })

    noteCacheData.lastSync = note.updated_at
    noteCacheData.lastMd5Hash = md5HashText(decryptedBody)

    if (updateFileName || updatePath) {
      await deleteMdFile(mdFile, config)
    }
    progress2.increment()
  }

  progress2.stop()
}

type OutdatedType = "Modified" | "New" | "LocationChanged"

/**
 * @returns the notes that were outdated from remote and were updated locally
 */
async function writeUpdatedNotesFromLocalToRemote(
  mdFileData: MarkdownFileSyncData[],
  command: Command,
  config: MemoneoConfig,
  auth: AuthResult,
  key: CryptoKey,
  gqlClient: Client
): Promise<MarkdownFileSyncData[]> {
  const outdatedLocalNotes = mdFileData.filter(data => !!data.outdatedType)

  // TODO what happens if a note is outdated from remote but was updated locally, what takes precedence?
  if (outdatedLocalNotes.length === 0) {
    command.log("No note changes found that could be written to remote.")
    return []
  }

  command.log("")
  command.log("Local notes that are outdated on remote:")
  outdatedLocalNotes.forEach(note =>
    command.log(
      `* ${limitTitleLength(note.note.title ?? "! Title missing")} - ${
        note.outdatedType
      }`
    )
  )
  command.log("")
  command.log("Do you want to write these changes to remote?")
  await promptConfirmation(command)

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
      localMd5Hash,
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
      const decryptedBody = mdFile.text

      // I'm not sure why this is done here, for the version?
      await writeNoteToFile(note, decryptedBody, config, noteFileData)

      const encryptedBody = await encryptText(mdFile.text, key)

      const { data, error } = await gqlClient
        .mutation(UpdateNoteMutation, {
          id: note.id,
          title: mdFile.metadata.title,
          body: encodeBase64String(encryptedBody.ctStr),
          bodyIv: encodeBase64String(encryptedBody.ivStr),
          date: mdFile.metadata.date,
          version: note.version,
        })
        .toPromise()
      if (error) {
        throw error
      }

      noteCacheData.lastMd5Hash = localMd5Hash
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

  return outdatedLocalNotes
}
