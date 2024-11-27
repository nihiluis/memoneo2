import axios from "axios"
import { File } from "expo-file-system/next"
import { z } from "zod"

const StatusSchema = z.enum(["queued", "failed", "completed", "uninitialized"])
const TranscriptionResponseSchema = z.object({
  message: z.literal("OK"),
  id: z.string().uuid(),
  status: StatusSchema,
})

export type TranscriptionStatus = z.infer<typeof StatusSchema>

const TranscriptionResultSchema = z.object({
  message: z.literal("OK"),
  id: z.string().uuid(),
  status: StatusSchema,
  text: z.string().nullable(),
})

type TranscriptionResult = z.infer<typeof TranscriptionResultSchema>

export async function queueTranscription(fileUri: string): Promise<string> {
  const file = new File(fileUri)

  const formData = new FormData()
  formData.append(
    "file",
    new Blob([file.bytes()], { type: "audio/x-m4a" }),
    "recording.m4a"
  )

  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_TRANSCRIBE_BASE_URL}/transcribe`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

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
