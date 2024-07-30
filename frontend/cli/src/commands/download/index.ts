import { Command } from "@oclif/core"
import {
  saveFileCache,
} from "../../shared/fileCache.js"
import { validateAuth } from "../../shared/validateAuth.js"
import { downloadNotes, writeNewNotes } from "../../shared/note/download.js"
import loadPrerequisites from "../../shared/loadPrerequisites.js"

export default class Download extends Command {
  static description = "Download notes"

  static examples = []

  static flags = {}

  static args = {}

  validateAuth = validateAuth.bind(this)

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Download)

    const {
      config,
      auth,
      key,
      internalConfig,
      cache,
      gqlClient,
    } = await loadPrerequisites()

    const downloadConfig = {
      gqlClient,
      auth,
      key,
      config,
      internalConfig,
      cache,
      command: this,
    }

    const notes = await downloadNotes(downloadConfig)
    await writeNewNotes(notes, downloadConfig)

    await saveFileCache(cache)
  }
}
