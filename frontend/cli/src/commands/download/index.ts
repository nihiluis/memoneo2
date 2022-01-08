import { Command, Flags } from "@oclif/core"
import protect from "await-protect"
import { validateAuth } from "../../shared/validateAuth"

export default class Download extends Command {
  static description = "Download notes"

  static examples = []

  static flags = {}

  static args = []

  validateAuth = validateAuth.bind(this)

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Download)

    const [_, authValidationError] = await protect(this.validateAuth())
    if (authValidationError) {
      this.error(authValidationError)
    }

    this.log("Auth successful.")
  }
}
