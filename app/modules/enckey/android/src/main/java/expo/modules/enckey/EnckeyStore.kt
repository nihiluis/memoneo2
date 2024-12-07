package expo.modules.enckey

import android.security.keystore.KeyProperties
import android.security.keystore.KeyProtection
import java.security.KeyStore
import javax.crypto.SecretKey

object EnckeyStore {
    private const val KEYSTORE_PROVIDER = "AndroidKeyStore"
    private const val KEY_ALIAS = "Memoneo"

    fun storeKey(secretKey: SecretKey) {
        val ks = KeyStore.getInstance(KEYSTORE_PROVIDER).apply {
            load(null)
        }

        // Store the secret key in the KeyStore
        val entry = KeyStore.SecretKeyEntry(secretKey)
        ks.setEntry(
            KEY_ALIAS,
            entry,
            KeyProtection.Builder(
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .build()
        )
    }

    fun retrieveKey(): SecretKey? {
        try {
            val ks = KeyStore.getInstance(KEYSTORE_PROVIDER).apply {
                load(null)
            }

            // Get the secret key from KeyStore
            val entry = ks.getEntry(KEY_ALIAS, null) as? KeyStore.SecretKeyEntry
                ?: return null
            
            return entry.secretKey
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        }
    }
}