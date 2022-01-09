import protect from "await-protect"
import * as fs from "fs/promises"

export interface MemoneoFileConfig {
  mail: string
  userId: string
}

export async function loadConfig(): Promise<MemoneoFileConfig | undefined> {
  const [configBuffer, err] = await protect(
    fs.readFile("./.memoneo/config.json")
  )
  if (!configBuffer) {
    return undefined
  }

  const config = JSON.parse(configBuffer.toString("utf-8"))

  // TODO validate config

  return config
}
