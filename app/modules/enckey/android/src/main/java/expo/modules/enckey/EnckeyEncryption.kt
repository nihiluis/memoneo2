package expo.modules.enckey

import android.util.Base64
import javax.crypto.Cipher
import javax.crypto.SecretKey

object EnckeyEncryption {
    fun encryptText(
        text: String,
        protectedKey: SecretKey
    ): String {
        // Initialize cipher
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, protectedKey)

        // Encrypt the text
        val ctBytes = cipher.doFinal(text.toByteArray())

        // Convert encrypted bytes to string
        val ctStr = Base64.encodeToString(ctBytes, Base64.DEFAULT)

        return ctStr
    }
}