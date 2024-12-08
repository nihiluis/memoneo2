import { Enckey } from "../auth/api"
import enckey from "@/modules/enckey"
import { RecordFileData } from "../audio/file"
import { randomUUID } from "expo-crypto"

export async function uploadTranscript(
  userId: string,
  recordFileData: RecordFileData,
  transcript: string,
  enckeyData: Enckey
) {
  let encryptedText = ""
  try {
    encryptedText = await enckey.encryptText(transcript)
  } catch (error) {
    console.error("Failed to encrypt transcript", error)
    return
  }

  const uuid = randomUUID()

  const title = recordFileData.title
  const date = new Date(recordFileData.timestamp).toISOString()

  const note = {
    id: uuid,
    body: encryptedText,
    title,
    date,
    archived: false,
    version: 1,
    user_id: userId,
  }

  console.log(note)
}
