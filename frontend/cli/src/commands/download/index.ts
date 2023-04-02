import { Command, Flags } from "@oclif/core"
import { gql } from "@urql/core"
import protect from "await-protect"
import { createGqlClient } from "../../lib/gql"
import { decryptText } from "../../lib/key"
import { decodeBase64String } from "../../shared/base64"
import {
  loadFileCache,
  reloadOrCreateFileCache,
  saveFileCache,
} from "../../shared/fileCache"
import { loadConfig, loadInternalConfig } from "../../shared/config"
import { loadKey } from "../../shared/loadKey"
import { validateAuth } from "../../shared/validateAuth"
import * as path from "path"
import * as fs from "fs/promises"
import { downloadNotes, writeNewNotes } from "../../shared/note/download"
import loadPrerequisites from "../../shared/loadPrerequisites"

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
