package expo.modules.enckey

import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

object EnckeyEncryption {
    fun encryptText(
        text: String,
        saltStr: String,
        protectedKey: SecretKey
    ): String {
        // Convert salt string to IV bytes
        val iv = saltStr.map { it.code.toByte() }.toByteArray()

        // Initialize cipher
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, protectedKey, GCMParameterSpec(128, iv))

        // Encrypt the text
        val ctBytes = cipher.doFinal(text.toByteArray())

        // Convert encrypted bytes to string
        val ctStr = ctBytes.map { byte -> byte.toInt().toChar() }.joinToString("")

        return ctStr
    }
}