import { Command, Flags } from "@oclif/core"
import cli from "cli-ux"

export default class Init extends Command {
  static description = "Init Memoneo"

  static examples = []

  static flags = {
    mail: Flags.string({
      char: "m",
      description: "Your mail",
      required: false,
    }),
    password: Flags.string({
      char: "p",
      description: "Your password",
      required: false,
    }),
  }

  static args = []

  async run(): Promise<void> {
    const { flags } = await this.parse(Init)

    const mail = flags.mail || (await cli.prompt("What is your mail?"))
    const password =
      flags.password ||
      (await cli.prompt("What is your password?", { type: "hide" }))
  }
}
