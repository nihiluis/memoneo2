import { Command } from "@oclif/core"
import protect from "await-protect"
import { reloadOrCreateFileCache, saveFileCache } from "../../shared/fileCache"
import { loadConfig, loadInternalConfig } from "../../shared/config"
import { loadKey } from "../../shared/loadKey"
import { validateAuth } from "../../shared/validateAuth"
import * as fs from "fs/promises"
import { getAllMarkdownFiles, MarkdownFileInfo } from "../../lib/files"
import { uploadNewNotes } from "../../shared/note/upload"

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
    const mdFiles = await getAllMarkdownFiles(
      config.baseDirectory,
      targetDirectory
    )

    uploadNewNotes({
      mdFiles,
      auth,
      key,
      config,
      internalConfig,
      cache,
      command: this,
    })

    saveFileCache(cache)
  }
}
