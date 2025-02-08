import { Args, Command } from "@oclif/core"
import { saveFileCache } from "../../shared/fileCache.js"
import * as fs from "fs/promises"
import { getAllMarkdownFiles } from "../../lib/files.js"
import { uploadNewNotes } from "../../shared/note/upload.js"
import loadPrerequisites from "../../shared/loadPrerequisites.js"

export default class Download extends Command {
  static description = "Download notes"

  static examples = []

  static flags = {}

  static args = {
      dir: Args.string({
      description:
        "The target directory that is recursively searched for md files",
      required: false,
    })
  }

  async run(): Promise<void> {
    const { args } = await this.parse(Download)

    const {
      config,
      gqlClient,
      auth,
      key,
      internalConfig,
      cache,
    } = await loadPrerequisites()

    const targetDirectory: string = args["dir"] || config.baseDirectory
    const targetDirectoryStat = await fs.stat(targetDirectory)
    if (!targetDirectoryStat.isDirectory()) {
      this.error(
        `Provided target directory ${targetDirectory} is no valid directory`
      )
    }

    this.log(`Loading markdown files from ${targetDirectory}`)
    const mdFiles = await getAllMarkdownFiles(
      config.baseDirectory,
      targetDirectory
    )

    await uploadNewNotes({
      mdFiles,
      gqlClient,
      auth,
      key,
      config,
      internalConfig,
      cache,
      command: this,
      existingNotes: []
    })

    await saveFileCache(this, cache)
  }
}
