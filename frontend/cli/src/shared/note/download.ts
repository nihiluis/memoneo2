import { Command } from "@oclif/core"
import { Client, gql } from "@urql/core"
import { Note } from "."
import { AuthResult } from "../../lib/auth"
import { createGqlClient } from "../../lib/gql"
import { decryptText } from "../../lib/key"
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
  const { data, error } = await gqlClient.query(DownloadQuery).toPromise()
  if (error) {
    command.error(error)
  }

  if (!data) {
    command.error("Unable to retrieve data from the GQL API")
  }

  const notes: Note[] = data.note

  return notes
}

export async function decryptNotes(
  notes: Note[],
  { auth, key }: DownloadNotesConfig
): Promise<Note[]> {
  for (let note of notes) {
    const decryptedBody = await decryptText(
      decodeBase64String(note.body),
      decodeBase64String(auth.enckey!.salt),
      key
    )
    note.body = decryptedBody
  }

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

  for (let note of newNotes) {
    await writeNoteToFile(note, config, {
      title: note.file?.title ?? note.title,
      path: note.file?.path ?? config.defaultDirectory,
    })
    cache.trackedNoteIds.push(note.id)
  }

  return newNotes
}
