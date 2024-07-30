import { AuthResult, login } from "../lib/auth.js"
import * as fs from "fs/promises"
import { ux as cliUx } from "@oclif/core"
import { input, password as passwordInput } from "@inquirer/prompts"

export type LoginResult = AuthResult & { password: string; mail: string }

export async function performLogin(
  mail: string = "",
  password: string = ""
): Promise<LoginResult> {
  mail = mail || (await input({ message: "What is your mail?" }))
  password =
    password || (await passwordInput({ message: "What is your password?" }))

  cliUx.action.start("Authenticating mail=" + mail)
  const authResult = await login(mail, password)
  const { errorMessage, error, enckey, token, success } = authResult
  if (error || !success) {
    throw new Error(
      `Unable to auth using given mail and password due to: ${
        errorMessage ?? "no error given"
      }.`
    )
  }
  if (!enckey) {
    throw new Error("Your encryption key must be set up before using the CLI.")
  }

  cliUx.action.stop()

  const encodedToken = Buffer.from(token, "utf8")

  await fs.writeFile("./.memoneo/token", encodedToken, { encoding: "base64" })

  return { ...authResult, password, mail }
}
