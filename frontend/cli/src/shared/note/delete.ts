import { AuthResult } from "../../lib/auth.js"
import { MemoneoConfig, MemoneoInternalConfig } from "../config.js"
import { MemoneoFileCache } from "../fileCache.js"
import { Command } from "@oclif/core"
import { Client } from "@urql/core"
import { Note, NoteId } from "./index.js"
import { cliUx } from "../../lib/reexports.js"
import { NoteIdQuery } from "./query.js"
import { MarkdownFileInfo } from "../../lib/files.js"

interface DeleteNotesConfig {
  auth: AuthResult
  key: CryptoKey
  internalConfig: MemoneoInternalConfig
  config: MemoneoConfig
  cache: MemoneoFileCache
  command: Command
  gqlClient: Client
}

export async function deleteRemovedNotes(
  notes: NoteId[],
  markdownFiles: MarkdownFileInfo[],
  { command, cache }: DeleteNotesConfig
) {
  const noteMap = notes.reduce((dict, note) => {
    dict[note.id] = note
    return dict
  }, {} as { [key: string]: NoteId })
  const usedLocalNoteMap = {} as { [key: string]: boolean }

  markdownFiles.forEach(mdFile => {
    const id = mdFile.metadata.id

    if (!id) {
      return
    }

    usedLocalNoteMap[id] = true
  })

  const superfluousNotes: NoteId[] = Object.values(noteMap).filter(
    note => !(note.id in usedLocalNoteMap)
  )
  superfluousNotes.forEach(note => {
    const currentIdx = cache.trackedNoteIds.indexOf(note.id)
    cache.trackedNoteIds.splice(currentIdx, 1)

    delete cache.notes[note.id]
  })

  command.log(`Found ${superfluousNotes.length} superfluous notes`)

  cliUx.action.start("Deleting locally removed notes on remote")

  // todo cache
}
