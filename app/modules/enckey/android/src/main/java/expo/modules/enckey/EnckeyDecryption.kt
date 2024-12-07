package expo.modules.enckey

import java.security.MessageDigest
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

object EnckeyDecryption {
    private const val ALGORITHM = "AES/GCM/NoPadding"
    private const val TAG_LENGTH_BIT = 128 // GCM authentication tag length

    fun decryptProtectedKey(
        password: String,
        ctStr: String,
        ivStr: String
    ): SecretKey {
        // Generate password hash (equivalent to SHA-256)
        val pwHash = MessageDigest.getInstance("SHA-256")
            .digest(password.toByteArray(Charsets.UTF_8))

        // Convert IV string to bytes
        val iv = ivStr.toByteArray(Charsets.ISO_8859_1)

        // Create secret key from password hash
        val secretKey = SecretKeySpec(pwHash, "AES")

        // Initialize cipher
        val cipher = Cipher.getInstance(ALGORITHM).apply {
            init(
                Cipher.DECRYPT_MODE,
                secretKey,
                GCMParameterSpec(TAG_LENGTH_BIT, iv)
            )
        }

        // Convert ciphertext string to bytes and decrypt
        val ctBytes = ctStr.toByteArray(Charsets.ISO_8859_1)
        val decryptedBytes = cipher.doFinal(ctBytes)
        
        // Convert decrypted bytes to SecretKey
        return SecretKeySpec(decryptedBytes, "AES")
    }
}