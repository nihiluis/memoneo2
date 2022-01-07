import { Command, Flags } from "@oclif/core"
import protect from "await-protect"
import cli from "cli-ux"
import * as fs from "fs/promises"
import { login } from "../../lib/auth"
import { decryptProtectedKey, getBufferForKey } from "../../lib/key"

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

    await fs.mkdir("./.memoneo", { recursive: true })

    const mail = flags.mail || (await cli.prompt("What is your mail?"))
    const password =
      flags.password ||
      (await cli.prompt("What is your password?", { type: "hide" }))

    const { enckey, token, error: loginError } = await login(mail, password)
    if (loginError) {
      this.error("Unable to auth using given mail and password.")
    }
    if (!enckey) {
      this.error("Your encryption key must be set up before using the CLI.")
    }

    const encodedToken = Buffer.from(token, "utf8")

    const [_, tokenWriteError] = await protect<void, Error>(
      fs.writeFile("./.memoneo/token", encodedToken, { encoding: "base64" })
    )
    if (tokenWriteError) {
      this.error(tokenWriteError)
    }

    const [key, keyError] = await protect<CryptoKey, Error>(
      decryptProtectedKey(password, atob(enckey.key), atob(enckey.salt))
    )
    if (keyError) {
      this.log("Unable to decrypt downloaded key\n" + JSON.stringify(enckey))
      this.error(keyError)
    }
    if (!key) {
      this.error("Unable to find decrypted key.")
    }

    const [encodedKey, encodeKeyError] = await protect<Buffer, Error>(
      getBufferForKey(key)
    )
    if (encodeKeyError) {
      this.error(encodeKeyError)
    }

    const [_2, keyWriteError] = await protect<void, Error>(
      fs.writeFile("./.memoneo/key", encodedKey!.toString("base64"), {
        encoding: "utf8",
      })
    )
    if (keyWriteError) {
      this.error(keyWriteError)
    }

    const configData = { mail }

    const [_3, configWriteError] = await protect(
      fs.writeFile("./.memoneo/config.json", JSON.stringify(configData), {
        encoding: "utf-8",
      })
    )
    if (configWriteError) {
      this.error(configWriteError)
    }

    this.log("Initialized.")
  }
}
