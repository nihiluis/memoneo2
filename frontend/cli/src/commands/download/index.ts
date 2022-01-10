import { Command, Flags } from "@oclif/core"
import { gql } from "@urql/core"
import protect from "await-protect"
import { createGqlClient } from "../../lib/gql"
import { decryptText } from "../../lib/key"
import { loadConfig } from "../../shared/loadConfig"
import { loadKey } from "../../shared/loadKey"
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

export interface Note {
  id: string
  date: string
  body: string
  archived: boolean
  title: string
}

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

    const key = await loadKey()

    const [auth, authValidationError] = await protect(this.validateAuth(config))
    if (authValidationError || !auth) {
      this.error(authValidationError ?? new Error("Unable to retrieve auth"))
    }

    this.log("Auth successful")

    const gqlClient = createGqlClient(auth.token, config)
    const { data, error } = await gqlClient.query(DownloadQuery).toPromise()
    if (error) {
      this.error(error)
    }

    if (!data) {
      this.error("Unable to retrieve data from the GQL API")
    }

    const notes: Note[] = data.note

    notes.forEach(async note => {
      console.log(
        await decryptText(atob(note.body), atob(auth.enckey!.salt), key)
      )
    })
  }
}
