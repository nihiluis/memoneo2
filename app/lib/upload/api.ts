import enckey from "@/modules/enckey"
import { RecordFileData } from "../audio/file"
import { randomUUID } from "expo-crypto"
import axios from "axios"
import { getGqlWrapperUrl } from "../settings/urls"

export async function uploadTranscript(
  token: string,
  userId: string,
  recordFileData: RecordFileData,
  transcript: string,
) {
  console.log("Uploading transcript", transcript)
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

  try {
    console.log("Uploading note", note)
    const res = await axios.put(
      getGqlWrapperUrl("/note"),
      note,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    )
    console.log("Uploaded transcript", res.data)
  } catch (error) {
    console.error("Failed to upload transcript", error)
    return
  }
}
