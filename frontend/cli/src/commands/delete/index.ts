import { Args, Command } from "@oclif/core"
import { saveFileCache } from "../../shared/fileCache.js"
import * as fs from "fs/promises"
import { getAllMarkdownFiles } from "../../lib/files.js"
import { uploadNewNotes } from "../../shared/note/upload.js"
import loadPrerequisites from "../../shared/loadPrerequisites.js"
import { downloadNotes, writeNewNotes } from "../../shared/note/download.js"
import { syncNotes } from "../../shared/note/sync.js"
import { cliUx } from "../../lib/reexports.js"
import { deleteRemovedNotes } from "~/shared/note/delete.js"
import { NoteIdQuery } from "~/shared/note/query.js"
import { NoteId } from "~/shared/note/index.js"

export default class Delete extends Command {
  static description = "Delete notes"

  static examples = []

  static flags = {}

  static args = {
    dir: Args.string({
      description:
        "The target directory that is recursively searched for md files",
      required: false,
    }),
  }

  async run(): Promise<void> {
    const { args } = await this.parse(Delete)

    const { config, auth, key, internalConfig, cache, gqlClient } =
      await loadPrerequisites()

    const targetDirectory: string = args["dir"] || config.baseDirectory
    const targetDirectoryStat = await fs.stat(targetDirectory)
    if (!targetDirectoryStat.isDirectory()) {
      this.error(
        `Provided target directory ${targetDirectory} is no valid directory`
      )
    }

    cliUx.action.start(`Loading markdown files from ${targetDirectory}`)
    const mdFiles = await getAllMarkdownFiles(
      config.baseDirectory,
      targetDirectory
    )
    cliUx.action.stop()

    const { data, error } = await gqlClient.query(NoteIdQuery, {}).toPromise()
    if (error) {
      this.error(error)
    }

    if (!data) {
      this.error("Unable to retrieve data from the GQL API")
    }

    cliUx.action.stop()

    const deleteConfig = {
      auth,
      key,
      config,
      internalConfig,
      cache,
      gqlClient,
      command: this,
    }

    // could use Zod here
    const noteIds = data.note as NoteId[]

    await deleteRemovedNotes(noteIds, mdFiles, deleteConfig)

    await saveFileCache(cache)
  }
}
