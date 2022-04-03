import { Command } from "@oclif/core"
import { saveFileCache } from "../../shared/fileCache"
import * as fs from "fs/promises"
import { getAllMarkdownFiles } from "../../lib/files"
import { uploadNewNotes } from "../../shared/note/upload"
import loadPrerequisites from "../../shared/loadPrerequisites"
import { downloadNotes, writeNewNotes } from "../../shared/note/download"
import { syncNotes } from "../../shared/note/sync"
import { dirxml } from "console"
import { cli } from "../../lib/reexports"

export default class Sync extends Command {
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

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Sync)

    const {
      config,
      auth,
      key,
      internalConfig,
      cache,
      gqlClient,
    } = await loadPrerequisites()

    const targetDirectory: string = args["dir"] || config.baseDirectory
    const targetDirectoryStat = await fs.stat(targetDirectory)
    if (!targetDirectoryStat.isDirectory()) {
      this.error(
        `Provided target directory ${targetDirectory} is no valid directory`
      )
    }

    cli.ux.action.start(`Loading markdown files from ${targetDirectory}`)
    const mdFiles = await getAllMarkdownFiles(
      config.baseDirectory,
      targetDirectory
    )
    cli.ux.action.stop()

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

    await uploadNewNotes({ mdFiles, ...downloadConfig })

    await syncNotes({ notes, mdFiles, ...downloadConfig })

    await saveFileCache(cache)
  }
}
