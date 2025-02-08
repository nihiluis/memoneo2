import { Args, Command } from "@oclif/core"
import { saveFileCache } from "../../shared/fileCache.js"
import * as fs from "fs/promises"
import { getAllMarkdownFiles } from "../../lib/files.js"
import loadPrerequisites from "../../shared/loadPrerequisites.js"
import { cliUx } from "../../lib/reexports.js"
import { deleteRemovedNotes } from "../../shared/note/delete.js"
import { NoteIdQuery } from "../../shared/note/query.js"
import { NoteIdAndTitle } from "../../shared/note/index.js"
import { promptConfirmation } from "../../shared/confirmation.js"
import {
  ArchiveNoteMutation,
  DeleteNotesMutation,
} from "../../shared/note/mutation.js"
import { limitTitleLength } from "../../shared/note/noteTitle.js"
import { removeIdFromMetadataInFile } from "../../shared/note/write.js"

export default class Cleanup extends Command {
  static description = "Cleanup notes"

  static examples = []

  static flags = {}

  static args = {
    dir: Args.string({
      description:
        "The target directory that is recursively searched for md files",
      required: true,
    }),
  }

  async run(): Promise<void> {
    const { args } = await this.parse(Cleanup)

    const { config, auth, key, internalConfig, cache, gqlClient } =
      await loadPrerequisites()

    const targetDirectory = args["dir"]
    if (!targetDirectory) {
      this.error("Please provide a target directory")
    }

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

    const noteIds = mdFiles.map(mdFile => mdFile.metadata.id).filter(id => !!id)
    mdFiles.forEach(mdFile =>
      this.log(
        `* ${limitTitleLength(mdFile.metadata.title ?? "! Title missing")}`
      )
    )

    await promptConfirmation(
      this,
      "Are you sure you want to cleanup these notes?\n" +
        "This will remove the ids from the metadata in the files and delete the notes on remote.",
      { exit: true }
    )

    const { data, error } = await gqlClient
      .mutation(DeleteNotesMutation, { ids: noteIds })
      .toPromise()

    if (!data || error) {
      this.error("Unable to retrieve data from the GQL API")
    }

    for (const mdFile of mdFiles) {
      if (!noteIds.includes(mdFile.metadata.id)) {
        continue
      }

      await removeIdFromMetadataInFile(mdFile, config)
    }
  }
}
