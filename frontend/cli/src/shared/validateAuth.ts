import { Command } from "@oclif/core"
import protect from "await-protect"

import * as fs from "fs/promises"
import { AuthResult, checkAuth } from "../lib/auth"
import { performLogin } from "./login"

export async function validateAuth(this: Command): Promise<AuthResult> {
  const login = performLogin.bind(this)

  const [_, fileExistsError] = await protect(fs.stat("./.memoneo/token"))
  if (fileExistsError) {
    throw new Error("Unable to find token file. Make sure you have used the init command first.")
  }
  const tokenBuffer = await fs.readFile("./.memoneo/token")

  const tokenString = tokenBuffer.toString("utf-8")

  const authResult = await checkAuth(tokenString)

  if (!authResult.success) {
    return await login()
  } else {
    return authResult
  }
}
