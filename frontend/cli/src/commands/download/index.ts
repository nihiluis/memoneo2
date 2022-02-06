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
import { downloadNewNotes } from "../../shared/note/download"

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

    const cache = await reloadOrCreateFileCache()

    const key = await loadKey()

    const [auth, authValidationError] = await protect(
      this.validateAuth(internalConfig)
    )
    if (authValidationError || !auth) {
      this.error(authValidationError ?? new Error("Unable to retrieve auth"))
    }

    downloadNewNotes({
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
