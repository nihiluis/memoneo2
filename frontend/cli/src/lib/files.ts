import * as fs from "fs/promises"
import * as path from "path"
import markdownParser from "./markdownParser"

export interface MarkdownFileMetadata {
  id: string
  title: string
  date: string
}

export interface MarkdownFileInfo {
  path: string
  text: string
  metadata?: MarkdownFileMetadata
}

export async function getAllMarkdownFiles(
  dir: string,
  arrayOfFiles: MarkdownFileInfo[] = []
): Promise<MarkdownFileInfo[]> {
  const files = await fs.readdir(dir)

  for (let file of files) {
    const filePath = path.join(dir, file)
    const stat = await fs.stat(filePath)
    if (stat.isDirectory()) {
      const dirFiles = await getAllMarkdownFiles(filePath, arrayOfFiles)
      arrayOfFiles = dirFiles
    } else {
      if (file.endsWith(".md")) {
        const fileContentBuffer = await fs.readFile(filePath)
        const fileContent = fileContentBuffer.toString("utf-8")

        const mdContent = markdownParser(fileContent)

        const info: MarkdownFileInfo = {
          path: path.join(__dirname, filePath),
          text: mdContent.content,
          metadata: mdContent.metadata,
        }
        arrayOfFiles.push(info)
      }
    }
  }

  return arrayOfFiles
}
