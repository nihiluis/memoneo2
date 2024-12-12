import { Elysia } from "elysia"
import { PORT } from "./env.js"
import {
  insertNoteHandler,
  insertNoteValidation,
} from "./handlers/insertNote.js"

const app = new Elysia()
  .get("/", () => "OK")
  .put("/note", insertNoteHandler, insertNoteValidation)
  .listen(PORT)

console.log(
  `Running at ${app.server?.hostname}:${app.server?.port}`
)
