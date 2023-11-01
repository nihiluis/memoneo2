import protect from "await-protect"
import { AuthResult, login } from "../lib/auth"
import Init from "../commands/init"
import * as fs from "fs/promises"
import { Command, ux as cliUx } from "@oclif/core"

export type LoginResult = AuthResult & { password: string; mail: string }

export async function performLogin(
  mail: string = "",
  password: string = ""
): Promise<LoginResult> {
  mail = mail || (await cliUx.prompt("What is your mail?"))
  password =
    password || (await cliUx.prompt("What is your password?", { type: "hide" }))

  cliUx.action.start("Authenticating mail=" + mail)
  const authResult = await login(mail, password)
  const { errorMessage, error, enckey, token, success } = authResult
  if (error || !success) {
    throw new Error(`Unable to auth using given mail and password due to: ${errorMessage ?? "no error given"}.`)
  }
  if (!enckey) {
    throw new Error("Your encryption key must be set up before using the CLI.")
  }

  cliUx.action.stop()

  const encodedToken = Buffer.from(token, "utf8")

  await fs.writeFile("./.memoneo/token", encodedToken, { encoding: "base64" })

  return { ...authResult, password, mail }
}
