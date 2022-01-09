import { Command, Flags } from "@oclif/core"
import { gql } from "@urql/core"
import protect from "await-protect"
import { createGqlClient } from "../../lib/gql"
import { loadConfig } from "../../shared/loadConfig"
import { validateAuth } from "../../shared/validateAuth"

const DownloadQuery = gql`
  query DownloadQuery {
    note {
      id
      date
      body
      archived
      title
    }
  }
`

export default class Download extends Command {
  static description = "Download notes"

  static examples = []

  static flags = {}

  static args = []

  validateAuth = validateAuth.bind(this)

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Download)

    const config = await loadConfig()
    if (!config) {
      this.error(new Error("Initialize first via the init command"))
    }

    const [auth, authValidationError] = await protect(this.validateAuth(config))
    if (authValidationError || !auth) {
      this.error(authValidationError ?? new Error("Unable to retrieve auth"))
    }


    this.log("Auth successful.")

    const gqlClient = createGqlClient(auth.token, config)
    const result = await gqlClient.query(DownloadQuery).toPromise()
    console.log(JSON.stringify(result))
  }
}
