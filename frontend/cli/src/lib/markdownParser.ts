/**
 * MIT LICENSE
 * taken from https://github.com/ilterra/markdown-yaml-metadata-parser
 */

import detectNewline from "detect-newline"
import * as yaml from "js-yaml"

interface ParseResult {
  content: string
  metadata: any
}

const metadataParser = (text: string): ParseResult => {
  let METADATA_START: RegExp
  let METADATA_END: string
  let METADATA_FILE_END: string
  let result = {
    content: text,
    metadata: "" as any,
  }

  const validateMarkdownText = () => {}

  const setMetadataPatterns = async () => {
    const newline = detectNewline(text)
    METADATA_START = new RegExp(`^---${newline}`)
    METADATA_END = `${newline}---${newline}`
    METADATA_FILE_END = `${newline}---`
  }

  const splitTextWithMetadata = () => {
    const metadataEndIndex = text.indexOf(METADATA_END)
    if (metadataEndIndex !== -1) {
      result = {
        content: text.substring(metadataEndIndex + METADATA_END.length),
        metadata: text.substring(0, metadataEndIndex),
      }
    }
  }

  const splitTextWithOnlyMetadata = () => {
    if (!result.metadata && text.endsWith(METADATA_FILE_END)) {
      result = {
        content: "",
        metadata: text.substring(0, text.length - METADATA_FILE_END.length),
      }
    }
  }

  const extractContentAndMetadata = () => {
    if (METADATA_START.test(text)) {
      splitTextWithMetadata()
      splitTextWithOnlyMetadata()
    }
  }

  const removeStartPatternFromMetadata = () => {
    result = {
      ...result,
      metadata: result.metadata.replace(METADATA_START, "").trim(),
    }
  }

  yaml.load

  const parseMetadata = () => {
    const parseResult = result.metadata ? yaml.load(result.metadata) : {}
    result = {
      ...result,
      metadata: parseResult,
    }
  }

  const parse = () => {
    validateMarkdownText()
    setMetadataPatterns()
    extractContentAndMetadata()
    removeStartPatternFromMetadata()
    parseMetadata()
  }

  parse()
  return result
}

export default metadataParser
