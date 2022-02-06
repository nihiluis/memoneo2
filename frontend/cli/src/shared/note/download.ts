import { Command } from "@oclif/core"
import { gql } from "@urql/core"
import { Note } from "."
import { AuthResult } from "../../lib/auth"
import { createGqlClient } from "../../lib/gql"
import { decryptText } from "../../lib/key"
import { decodeBase64String } from "../base64"
import { MemoneoConfig, MemoneoInternalConfig } from "../config"
import { MemoneoFileCache } from "../fileCache"
import { writeNoteToFile } from "./write"

export const DownloadQuery = gql`
  query DownloadQuery {
    note {
      id
      date
      body
      archived
      title
      file {
        path
        title
      }
    }
  }
`

interface DownloadNewNotesConfig {
  auth: AuthResult
  key: CryptoKey
  internalConfig: MemoneoInternalConfig
  config: MemoneoConfig
  cache: MemoneoFileCache
  command: Command
}

export async function downloadNewNotes({
  auth,
  key,
  config,
  internalConfig,
  cache,
  command,
}: DownloadNewNotesConfig) {
  const gqlClient = createGqlClient(auth.token, internalConfig!)
  const { data, error } = await gqlClient.query(DownloadQuery).toPromise()
  if (error) {
    command.error(error)
  }

  if (!data) {
    command.error("Unable to retrieve data from the GQL API")
  }

  const notes: Note[] = data.note

  const newNotes: Note[] = notes.filter(
    note => !note.archived && !cache.trackedNoteIds.includes(note.id)
  )

  if (newNotes.length === 0) {
    command.log("No new notes to download found.")
    return
  }

  for (let note of newNotes) {
    const decryptedBody = await decryptText(
      decodeBase64String(note.body),
      decodeBase64String(auth.enckey!.salt),
      key
    )
    note.body = decryptedBody

    await writeNoteToFile(note, config, {
      title: note.file?.title ?? note.title,
      path: note.file?.path ?? config.defaultDirectory,
    })
    cache.trackedNoteIds.push(note.id)
  }
}
