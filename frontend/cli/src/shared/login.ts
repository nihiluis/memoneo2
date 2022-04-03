import protect from "await-protect"
import { AuthResult, login } from "../lib/auth"
import Init from "../commands/init"
import * as fs from "fs/promises"
import { Command, CliUx as cli } from "@oclif/core"

export type LoginResult = AuthResult & { password: string; mail: string }

export async function performLogin(
  mail: string = "",
  password: string = ""
): Promise<LoginResult> {
  mail = mail || (await cli.ux.prompt("What is your mail?"))
  password =
    password || (await cli.ux.prompt("What is your password?", { type: "hide" }))

  cli.ux.action.start("Authenticating")
  const authResult = await login(mail, password)
  const { error: loginError, enckey, token } = authResult
  if (loginError) {
    throw new Error(`Unable to auth using given mail and password due to: ${loginError}.`)
  }
  if (!enckey) {
    throw new Error("Your encryption key must be set up before using the CLI.")
  }

  cli.ux.action.stop()

  const encodedToken = Buffer.from(token, "utf8")

  await fs.writeFile("./.memoneo/token", encodedToken, { encoding: "base64" })

  return { ...authResult, password, mail }
}
