import protect from "await-protect"

import * as fs from "fs/promises"
import { AuthResult, checkAuth } from "../lib/auth.js"
import { MemoneoInternalConfig } from "./config.js"
import { performLogin } from "./login.js"

export async function validateAuth(
  config?: MemoneoInternalConfig
): Promise<AuthResult> {
  const [_, fileExistsError] = await protect(fs.stat("./.memoneo/token"))
  if (fileExistsError) {
    throw new Error(
      "Unable to find token file. Make sure you have used the init command first."
    )
  }
  const tokenBuffer = await fs.readFile("./.memoneo/token")

  const tokenString = tokenBuffer.toString("utf-8")

  const authResult = await checkAuth(tokenString)

  if (!authResult.success) {
    return await performLogin(config?.mail)
  } else {
    return authResult
  }
}
