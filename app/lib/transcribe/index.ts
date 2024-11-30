import axios from "axios"
import { File as ExpoFile } from "expo-file-system/next"
import { z } from "zod"

const StatusSchema = z.enum(["queued", "failed", "completed", "uninitialized"])
const TranscriptionResponseSchema = z.object({
  message: z.literal("OK"),
  id: z.string().uuid(),
  status: StatusSchema,
})

export type TranscriptionStatus = z.infer<typeof StatusSchema> | "error"

const TranscriptionResultSchema = z.object({
  message: z.literal("OK"),
  id: z.string().uuid(),
  status: StatusSchema,
  text: z.string().nullable(),
})

type TranscriptionResult = z.infer<typeof TranscriptionResultSchema>

export async function queueTranscription(fileUri: string): Promise<string> {
  const file = new ExpoFile(fileUri)

  const formData = new FormData()
  formData.append("file", {
    name: "recording.m4a",
    uri: fileUri,
    type: "audio/x-m4a",
  })

  const url = `${process.env.EXPO_PUBLIC_TRANSCRIBE_BASE_URL}/transcribe`
  console.log("queueTranscription formData to url", url)
  const response = await axios.post(
    url,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 1000,
    }
  )

  console.log("queueTranscription response", response.data)
  const result = TranscriptionResponseSchema.parse(response.data)

  return result.id
}

export async function getTranscription(
  id: string
): Promise<TranscriptionResult> {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_TRANSCRIBE_BASE_URL}/transcribe/${id}`
  )

  return TranscriptionResultSchema.parse(response.data)
}

export async function pollTranscription(
  id: string,
  timeoutSeconds = 10
): Promise<TranscriptionResult> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeoutSeconds * 1000) {
    console.log("polling transcription", id)
    const result = await getTranscription(id)

    if (result.status === "completed" || result.status === "failed") {
      return result
    }

    // Wait 1 second before next poll
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  throw new Error(
    `Transcription polling timed out after ${timeoutSeconds} seconds`
  )
}
