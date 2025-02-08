import { describe, it, expect } from "vitest"
import { decryptText } from "../lib/key.js"
import { loadKey } from "../shared/loadKey.js"
import { decodeBase64String } from "../shared/base64.js"

describe("Key Tests", () => {
  /**
   * Requires you to be logged in and have the key set up in the .memoneo config.
   */
  it("should pass a basic test", async () => {
    const testEncryptedBody = ``
    const testIv = ``

    const decodedEncryptedBody = decodeBase64String(testEncryptedBody)
    const decodedIv = decodeBase64String(testIv)

    const cryptoKey = await loadKey()

    const decryptedText = await decryptText(
      decodedEncryptedBody,
      decodedIv,
      cryptoKey
    )

    expect(decryptedText).toBe("test")
  })
})
