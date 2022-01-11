import protect from "await-protect"
import * as fs from "fs/promises"

export interface MemoneoFileCache {
  trackedNoteIds: string[]
}

export async function loadFileCache(): Promise<MemoneoFileCache | undefined> {
  const [cacheBuffer, err] = await protect(fs.readFile("./.memoneo/cache.json"))
  if (!cacheBuffer) {
    return undefined
  }

  const cache = JSON.parse(cacheBuffer.toString("utf-8"))

  // TODO validate config

  return cache
}

export async function saveFileCache(cache: MemoneoFileCache) {
  await fs.writeFile("./.memoneo/cache.json", JSON.stringify(cache))
}

export async function reloadOrCreateFileCache() {
  // todo impl load

  await createEmptyFileCache()
}

export async function createEmptyFileCache() {
  const cache: MemoneoFileCache = { trackedNoteIds: [] }

  await fs.writeFile("./.memoneo/cache.json", JSON.stringify(cache))
}
