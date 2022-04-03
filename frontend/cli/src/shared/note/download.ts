import { Command } from "@oclif/core"
import { Client, gql } from "@urql/core"
import { Note } from "."
import { AuthResult } from "../../lib/auth"
import { createGqlClient } from "../../lib/gql"
import { decryptText } from "../../lib/key"
import { cli } from "../../lib/reexports"
import { decodeBase64String } from "../base64"
import { MemoneoConfig, MemoneoInternalConfig } from "../config"
import { MemoneoFileCache } from "../fileCache"
import { DownloadQuery } from "./query"
import { writeNoteToFile } from "./write"

interface DownloadNotesConfig {
  auth: AuthResult
  key: CryptoKey
  internalConfig: MemoneoInternalConfig
  config: MemoneoConfig
  cache: MemoneoFileCache
  command: Command
  gqlClient: Client
}

export async function downloadNotes({
  auth,
  key,
  config,
  internalConfig,
  cache,
  gqlClient,
  command,
}: DownloadNotesConfig): Promise<Note[]> {
  cli.ux.action.start("Downloading notes")

  const { data, error } = await gqlClient.query(DownloadQuery).toPromise()
  if (error) {
    command.error(error)
  }

  if (!data) {
    command.error("Unable to retrieve data from the GQL API")
  }

  cli.ux.action.stop()

  const notes: Note[] = data.note

  return notes
}

export async function decryptNotes(
  notes: Note[],
  { auth, key }: DownloadNotesConfig
): Promise<Note[]> {
  const progress = cli.ux.progress({
    format: 'Decrypting... | {bar} | {value}/{total} notes',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  })

  progress.start(notes.length, 0)
  for (let note of notes) {
    const decryptedBody = await decryptText(
      decodeBase64String(note.body),
      decodeBase64String(auth.enckey!.salt),
      key
    )
    progress.increment()
    note.body = decryptedBody
  }
  progress.stop()

  return notes
}

export async function writeNewNotes(
  notes: Note[],
  downloadConfig: DownloadNotesConfig
): Promise<Note[]> {
  const { auth, key, config, internalConfig, cache, command } = downloadConfig

  const newNotes: Note[] = notes.filter(
    note => !note.archived && !cache.trackedNoteIds.includes(note.id)
  )

  if (newNotes.length === 0) {
    command.log("No new notes to download found.")
    return []
  }

  await decryptNotes(newNotes, downloadConfig)


  const progress = cli.ux.progress({
    format: 'Writing new notes... | {bar} | {value}/{total} notes',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  })

  progress.start(newNotes.length, 0)
  for (let note of newNotes) {
    await writeNoteToFile(note, config, {
      title: note.file?.title ?? note.title,
      path: note.file?.path ?? config.defaultDirectory,
    })
    cache.trackedNoteIds.push(note.id)
    progress.increment()
  }
  progress.stop()

  return newNotes
}
