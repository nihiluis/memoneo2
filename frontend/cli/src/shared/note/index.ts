export interface Note {
  id: string
  date: string
  body: string
  archived: boolean
  title: string
  file?: NoteFileData
  user_id: string
}

export interface NoteFileData {
  title: string
  path: string
  note_id?: string
}
