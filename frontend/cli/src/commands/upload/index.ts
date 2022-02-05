import { Command } from "@oclif/core"
import { gql } from "@urql/core"
import protect from "await-protect"
import { createGqlClient } from "../../lib/gql"
import { decodeBase64String } from "../../shared/base64"
import { reloadOrCreateFileCache, saveFileCache } from "../../shared/fileCache"
import { loadConfig, loadInternalConfig } from "../../shared/config"
import { loadKey } from "../../shared/loadKey"
import { Note, writeNoteToFile } from "../../shared/note"
import { validateAuth } from "../../shared/validateAuth"
import * as fs from "fs/promises"
import { getAllMarkdownFiles } from "../../lib/files"

const InsertNoteMutation = gql`
  mutation InsertNoteMutation($inputs: [note_insert_input!]!) {
    insert_note(objects: $inputs) {
      affected_rows
    }
  }
`

const InsertNoteFileDataMutation = gql`
  mutation InsertFileDataMutation($inputs: [file_data_insert_input!]!) {
    insert_file_data(objects: $inputs) {
      affected_rows
    }
  }
`

export default class Download extends Command {
  static description = "Download notes"

  static examples = []

  static flags = {}

  static args = [
    {
      name: "dir",
      description:
        "The target directory that is recursively searched for md files",
      required: false,
    },
  ]

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

    const targetDirectory: string = args["dir"] || config.baseDirectory
    const targetDirectoryStat = await fs.stat(targetDirectory)
    if (!targetDirectoryStat.isDirectory()) {
      this.error(
        `Provided target directory ${targetDirectory} is no valid directory`
      )
    }

    const cache = await reloadOrCreateFileCache()

    const key = await loadKey()

    const [auth, authValidationError] = await protect(
      this.validateAuth(internalConfig)
    )
    if (authValidationError || !auth) {
      this.error(authValidationError ?? new Error("Unable to retrieve auth"))
    }

    this.log(`Loading markdown files from ${targetDirectory}`)
    const mdFiles = await getAllMarkdownFiles(targetDirectory)
    mdFiles.forEach(file => this.log(JSON.stringify(file)))

    const newNotes: Note[] = []

    if (newNotes.length === 0) {
      this.log("No new notes to upload found.")
      return
    }

    const gqlClient = createGqlClient(auth.token, internalConfig!)
    const { data, error } = await gqlClient
      .mutation(InsertNoteMutation, { inputs: newNotes })
      .toPromise()
    if (error) {
      this.error(error)
    }

    if (!data) {
      this.error("Unable to mutate data with the GQL API")
    }

    saveFileCache(cache)
  }
}
