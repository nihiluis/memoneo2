import protect from "await-protect"
import cli from "cli-ux"
import { AuthResult, login } from "../lib/auth"
import Init from "../commands/init"
import * as fs from "fs/promises"
import { Command } from "@oclif/core"

export type LoginResult = AuthResult & { password: string; mail: string }

export async function performLogin(
  this: Command,
  mail: string = "",
  password: string = ""
): Promise<LoginResult> {
  mail = mail || (await cli.prompt("What is your mail?"))
  password =
    password || (await cli.prompt("What is your password?", { type: "hide" }))

  const authResult = await login(mail, password)
  const { error: loginError, enckey, token } = authResult
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

  return { ...authResult, password, mail }
}