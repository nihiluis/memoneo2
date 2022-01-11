import { Command, Flags } from "@oclif/core"
import { gql } from "@urql/core"
import protect from "await-protect"
import { createGqlClient } from "../../lib/gql"
import { decryptText } from "../../lib/key"
import { decodeBase64String } from "../../shared/base64"
import { loadFileCache, saveFileCache } from "../../shared/fileCache"
import { loadConfig, loadInternalConfig } from "../../shared/config"
import { loadKey } from "../../shared/loadKey"
import { Note, writeNoteToFile } from "../../shared/note"
import { validateAuth } from "../../shared/validateAuth"
import * as path from "path"
import * as fs from "fs/promises"

const DownloadQuery = gql`
  query DownloadQuery {
    note {
      id
      date
      body
      archived
      title
    }
  }
`

export default class Download extends Command {
  static description = "Download notes"

  static examples = []

  static flags = {}

  static args = []

  validateAuth = validateAuth.bind(this)

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Download)

    const internalConfig = await loadInternalConfig()
    if (!internalConfig) {
      this.error(new Error("Initialize first via the init command"))
    }
    const [config, configErr] = await protect(loadConfig())
    if (configErr || !config) {
      this.error(configErr ?? "Config null")
    }

    const cache = await loadFileCache()
    if (!cache) {
      this.error("Unable to load file cache")
    }

    const key = await loadKey()
    this.log("Key retrieved")

    const [auth, authValidationError] = await protect(
      this.validateAuth(internalConfig)
    )
    if (authValidationError || !auth) {
      this.error(authValidationError ?? new Error("Unable to retrieve auth"))
    }

    this.log("Auth successful")

    const gqlClient = createGqlClient(auth.token, internalConfig!)
    const { data, error } = await gqlClient.query(DownloadQuery).toPromise()
    if (error) {
      this.error(error)
    }

    if (!data) {
      this.error("Unable to retrieve data from the GQL API")
    }

    const notes: Note[] = data.note

    const newNotes: Note[] = notes.filter(
      note => !note.archived && !cache.trackedNoteIds.includes(note.id)
    )

    const defaultDirPath = path.join(".", config.defaultDirectory)
    await fs.mkdir(defaultDirPath, { recursive: true })

    newNotes.forEach(async note => {
      writeNoteToFile(
        note,
        defaultDirPath,
        decodeBase64String(auth.enckey!.salt),
        key
      )
      cache.trackedNoteIds.push(note.id)
    })

    saveFileCache(cache)
  }
}
