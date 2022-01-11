import { Command, Flags } from "@oclif/core"
import protect from "await-protect"
import * as fs from "fs/promises"
import { decryptProtectedKey, getBufferForKey } from "../../lib/key"
import { crypto } from "../../lib/reexports"
import { decodeBase64String, encodeBase64String } from "../../shared/base64"
import { reloadOrCreateFileCache } from "../../shared/fileCache"
import { loadConfig, MemoneoInternalConfig } from "../../shared/config"
import { performLogin } from "../../shared/login"

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

  login = performLogin.bind(this)

  async run(): Promise<void> {
    const { flags } = await this.parse(Init)

    await fs.mkdir("./.memoneo", { recursive: true })

    const { enckey, password, userId, mail } = await this.login(
      flags.mail,
      flags.password
    )

    const [key, keyError] = await protect<CryptoKey, Error>(
      decryptProtectedKey(
        password,
        decodeBase64String(enckey!.key),
        decodeBase64String(enckey!.salt)
      )
    )
    if (keyError) {
      this.log("Unable to decrypt downloaded key\n" + JSON.stringify(enckey))
      this.error(keyError)
    }
    if (!key) {
      this.error("Unable to find decrypted key.")
    }

    const [encodedKey, encodeKeyError] = await protect(
      crypto.subtle.exportKey("raw", key)
    )
    if (encodeKeyError) {
      this.error(encodeKeyError)
    }

    const keyArray = Array.from(new Uint8Array(encodedKey!))
    const keyStr = keyArray.map(byte => String.fromCharCode(byte)).join("")

    await fs.writeFile("./.memoneo/key", encodeBase64String(keyStr))

    await reloadOrCreateFileCache()

    const configData: MemoneoInternalConfig = { mail, userId }

    await fs.writeFile("./.memoneo/config.json", JSON.stringify(configData), {
      encoding: "utf-8",
    })

    loadConfig()

    this.log("Initialized.")
  }
}
