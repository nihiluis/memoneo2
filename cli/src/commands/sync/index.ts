import { Args, Command } from "@oclif/core"
import { saveFileCache } from "../../shared/fileCache.js"
import * as fs from "fs/promises"
import { getAllMarkdownFiles } from "../../lib/files.js"
import { uploadNewNotes } from "../../shared/note/upload.js"
import loadPrerequisites from "../../shared/loadPrerequisites.js"
import { downloadNotes, writeNewNotes } from "../../shared/note/download.js"
import { syncNotes } from "../../shared/note/sync.js"
import { cliUx } from "../../lib/reexports.js"

export default class Sync extends Command {
  static description = "Download notes"

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
    const { args } = await this.parse(Sync)

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

    const downloadConfig = {
      auth,
      key,
      config,
      internalConfig,
      cache,
      gqlClient,
      command: this,
    }

    const notes = await downloadNotes(downloadConfig)
    await writeNewNotes(notes, downloadConfig)

    await uploadNewNotes({ existingNotes: notes, mdFiles, ...downloadConfig })

    await syncNotes({ notes, mdFiles, ...downloadConfig })

    await saveFileCache(cache)
  }
}
