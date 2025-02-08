package expo.modules.enckey

import android.annotation.SuppressLint
import android.util.Base64
import android.util.Log
import org.bouncycastle.jce.provider.BouncyCastleProvider
import java.security.MessageDigest
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

object EnckeyDecryption {
    private const val ALGORITHM = "AES/GCM/NoPadding"
    private const val TAG_LENGTH_BIT = 128 // GCM authentication tag length
    private const val TAG = "EnckeyDecryption"

    @SuppressLint("DeprecatedProvider")
    fun decryptProtectedKey(
        password: String,
        ctStr: String,
        ivStr: String
    ): SecretKey {
        Log.d(TAG, "Decrypting key")

        val decodedCtStr = Base64.decode(ctStr, Base64.DEFAULT)
        val decodedIvStr = Base64.decode(ivStr, Base64.DEFAULT)

        // Generate password hash (equivalent to SHA-256)
        val pwHash = MessageDigest.getInstance("SHA-256")
            .digest(password.toByteArray(Charsets.UTF_8))

        // Create secret key from password hash
        val secretKey = SecretKeySpec(pwHash, "AES")

        // Initialize cipher
        val cipher = Cipher.getInstance(ALGORITHM).apply {
            init(
                Cipher.DECRYPT_MODE,
                secretKey,
                GCMParameterSpec(TAG_LENGTH_BIT, decodedIvStr)
            )
        }

        // Convert ciphertext string to bytes and decrypt
        val decryptedBytes = cipher.doFinal(decodedCtStr)
        
        // Convert decrypted bytes to SecretKey
        return SecretKeySpec(decryptedBytes, "AES")
    }
}