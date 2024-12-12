import { Context, t } from "elysia"
import { InsertNoteMutation } from "../mutation.js"
import { cacheExchange, Client, createClient, fetchExchange } from "@urql/core"
import { getToken } from "./utils.js"
import { gqlClient } from "../client.js"
import { createLogger } from "../logger.js"
import { ENDPOINT_GQL_URL } from "../env.js"

const NoteSchema = t.Object({
  id: t.String(),
  body: t.String(),
  title: t.String(),
  date: t.String(),
  archived: t.Boolean(),
  version: t.Number(),
  user_id: t.String(),
})

type Note = (typeof NoteSchema)["static"]

type InsertNoteResponse = {
  message: string
  data: Note[]
}

const logger = createLogger()

export const insertNoteHandler = async ({
  headers,
  body,
}: Context<{ headers: { authorization: string }; body: Note }>) => {
  const token = getToken(headers)
  await insertNote(gqlClient, token, body)
}

export const insertNoteValidation = {
  headers: t.Object({ authorization: t.String() }),
  body: NoteSchema,
}

async function insertNote(
  gqlClient: Client,
  token: string,
  note: Note
): Promise<InsertNoteResponse> {
  logger.info({ note }, "Inserting note")

  const { data, error } = await gqlClient
    .mutation(
      InsertNoteMutation,
      {
        inputs: [note],
      },
      {
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Hasura-User-Id": note.user_id,
          },
        },
      }
    )
    .toPromise()

  if (error) {
    logger.error({ error, data }, "Failed to insert note")
    throw error
  }

  logger.info("Inserted note")
  return { message: "OK", data }
}
