import protect from "await-protect"
import * as fs from "fs/promises"

const CACHE_PATH = "./.memoneo/cache.json"

export interface MemoneoFileCache {
  trackedNoteIds: string[]
}

export async function loadFileCache(): Promise<MemoneoFileCache | undefined> {
  const [cacheBuffer, err] = await protect(fs.readFile(CACHE_PATH))
  if (!cacheBuffer) {
    return undefined
  }

  const cache = JSON.parse(cacheBuffer.toString("utf-8"))

  // TODO validate config

  return cache
}

export async function saveFileCache(cache: MemoneoFileCache) {
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache))
}

export async function reloadOrCreateFileCache(): Promise<MemoneoFileCache> {
  // todo impl load

  const cacheStat = await fs.stat(CACHE_PATH)
  
  if (!cacheStat.isFile()) {
    return await createEmptyFileCache()
  }
  
  const cache = await loadFileCache()
  if (!cache) {
    throw new Error("unable to load cache")
  }
  
  return cache
}

export async function createEmptyFileCache(): Promise<MemoneoFileCache> {
  const cache: MemoneoFileCache = { trackedNoteIds: [] }

  await fs.writeFile(CACHE_PATH, JSON.stringify(cache))

  return cache
}
