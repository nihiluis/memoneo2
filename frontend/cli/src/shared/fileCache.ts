import protect from "await-protect"
import * as fs from "fs/promises"

const CACHE_PATH = "./.memoneo/cache.json"

export interface MemoneoFileCache {
  trackedNoteIds: string[]
  notes: Record<string, NoteCacheData>
  getOrCreateNoteCacheData(id: string): NoteCacheData
}

export interface NoteCacheData {
  lastSync: string
  lastMd5Hash: string
}

export async function loadFileCache(): Promise<MemoneoFileCache | undefined> {
  const [cacheBuffer, err] = await protect(fs.readFile(CACHE_PATH))
  if (!cacheBuffer) {
    return undefined
  }

  const cache = JSON.parse(cacheBuffer.toString("utf-8"))
  cache.getOrCreateNoteCacheData = (id: string) =>
    getOrCreateNoteCacheData(cache, id)

  // TODO validate config

  return cache
}

export async function saveFileCache(cache: MemoneoFileCache) {
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache))
}

export async function reloadOrCreateFileCache(): Promise<MemoneoFileCache> {
  // todo impl load
  const [_, err] = await protect(fs.access(CACHE_PATH))

  if (err) {
    // assuming file does not exist
    return await createEmptyFileCache()
  }

  const cache = await loadFileCache()
  if (!cache) {
    throw new Error("unable to load cache")
  }

  return cache
}

export async function createEmptyFileCache(): Promise<MemoneoFileCache> {
  const cache: MemoneoFileCache = {
    trackedNoteIds: [],
    notes: {},
    getOrCreateNoteCacheData: (id: string) =>
      getOrCreateNoteCacheData(cache, id),
  }

  await fs.writeFile(CACHE_PATH, JSON.stringify(cache))

  return cache
}

function getOrCreateNoteCacheData(
  cache: MemoneoFileCache,
  id: string
): NoteCacheData {
  if (!cache.notes.hasOwnProperty(id)) {
    cache.notes[id] = { lastMd5Hash: "", lastSync: "" }
  }

  return cache.notes[id]
}
